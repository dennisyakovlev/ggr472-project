/*  simulated namespace for setup file
*/
const SETUP = {
    btnSites: null,  // button for contaimated sites layer
    btnWater: null,  // button for water treatment plants
    btnAir: null,    // button for air monitoring stations
    btnIndex: null,  // button for chrolopeth index
    switchHelp: null // switch to display help screen 
};

/*  create all necesseceary addons like buttons and menus
*/
function initMap()
{
    /* set up main menu for switching between different map layers */
    const mainMenu = new Menu('menu-btn-main');
    mainMenu.enableAnim();

    SETUP.btnSites = new Button('btn-1');
    SETUP.btnSites.enableAnim();
    SETUP.btnSites.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'sites', 0);

        genSitesPoints();
    });
    SETUP.btnSites.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'sites', 0);

        clearSitesHexGrid(); // must be before fore isOn to be true
        clearSitesPoints();
    });

    SETUP.btnWater = new Button('btn-2');
    SETUP.btnWater.enableAnim();
    SETUP.btnWater.addOnFunc('click', (e,state) => {
        genWaterPoint();
    });
    SETUP.btnWater.addOffFunc('click', (e,state) => {
        clearWaterPoint();
    });

    SETUP.btnAir = new Button('btn-3a');
    SETUP.btnAir.enableAnim();
    SETUP.btnAir.addOnFunc('click', (e,state) => {
        genAirPoints();
    });
    SETUP.btnAir.addOffFunc('click', (e,state) => {
        clearAirPoints();
    });

    SETUP.btnIndex = new Button('btn-3');
    SETUP.btnIndex.enableAnim();
    SETUP.btnIndex.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'index', 1);

        clearIndexPoly();
    });
    SETUP.btnIndex.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'index', 1);

        genIndexPoly();
    });

    SETUP.switchHelp = new Button('btn-20');
    SETUP.switchHelp.enableAnim();
    SETUP.switchHelp.addOnFunc('click', (e,state) => {
        $('#screen-3')
            .addClass('screen-anim-in-fast map-front')
            .removeClass('map-back screen-anim-out');
    });
    SETUP.switchHelp.addOffFunc('click', (e,state) => {
        $('#screen-3')
            .addClass('screen-anim-out')
            .removeClass('screen-anim-in-fast');
    });
}

/*  initialze the main menu
*/
function initMenu()
{
    // sites related
    const secondaryMenuSites = new SecondaryMenu('secondary-menu-sites', SETUP.btnSites, 0);
    secondaryMenuSites.enableAnim();
    SETUP.btnSites.addOnFunc('click', (e,state) => secondaryMenuSites.forceTransition());

    const secondaryBtnSitesHex = new Button('btn-secondary-sites-hex');
    secondaryBtnSitesHex.enableAnim();
    secondaryBtnSitesHex.addOnFunc('click', (e,state) => genSitesHexGrid());
    secondaryBtnSitesHex.addOffFunc('click', (e,state) => clearSitesHexGrid());

    const primaryInfoBtnSites = new Button('btn-10');
    primaryInfoBtnSites.enableAnim();
    primaryInfoBtnSites.addOnFunc('click', (e,state) => $(`#info-popup-sites`)
        .removeClass('mapinfo-anim-out')
        .addClass('mapinfo-anim-in'));
    primaryInfoBtnSites.addOffFunc('click', (e,state) => $(`#info-popup-sites`)
        .removeClass('mapinfo-anim-in')
        .addClass('mapinfo-anim-out'));



    // water related
    const secondaryMenuWater = new SecondaryMenu('secondary-menu-water', SETUP.btnWater, 0);
    secondaryMenuWater.enableAnim();
    SETUP.btnWater.addOnFunc('click', (e,state) => secondaryMenuWater.forceTransition());

    const secondaryBtnWaterHover = new Button('btn-secondary-water-hover');
    secondaryBtnWaterHover.enableAnim();
    secondaryBtnWaterHover.addOnFunc('click', (e,state) => disablePopupWater());
    secondaryBtnWaterHover.addOffFunc('click', (e,state) => enablePopupWater());

    const secondaryBtnWaterArea = new Button('btn-secondary-water-area');
    secondaryBtnWaterArea.enableAnim();
    secondaryBtnWaterArea.addOnFunc('click', (e,state) => disableAreaEffectWater());
    secondaryBtnWaterArea.addOffFunc('click', (e,state) => enableAreaEffectWater());

    const primaryInfoBtnWater = new Button('btn-11');
    primaryInfoBtnWater.enableAnim();
    primaryInfoBtnWater.addOnFunc('click', (e,state) => $(`#info-popup-water`)
        .removeClass('mapinfo-anim-out')
        .addClass('mapinfo-anim-in'));
    primaryInfoBtnWater.addOffFunc('click', (e,state) => $(`#info-popup-water`)
        .removeClass('mapinfo-anim-in')
        .addClass('mapinfo-anim-out'));



    // air related
    const secondaryMenuAir = new SecondaryMenu('secondary-menu-air', SETUP.btnAir, 0);
    secondaryMenuAir.enableAnim();
    SETUP.btnAir.addOnFunc('click', (e,state) => secondaryMenuAir.forceTransition());

    const secondaryBtnAirHover = new Button('btn-secondary-air-hover');
    secondaryBtnAirHover.enableAnim();
    secondaryBtnAirHover.addOnFunc('click', (e,state) => disablePopupAir());
    secondaryBtnAirHover.addOffFunc('click', (e,state) => enablePopupAir());

    const primaryInfoBtnAir = new Button('btn-12');
    primaryInfoBtnAir.enableAnim();
    primaryInfoBtnAir.addOnFunc('click', (e,state) => $(`#info-popup-air`)
        .removeClass('mapinfo-anim-out')
        .addClass('mapinfo-anim-in'));
    primaryInfoBtnAir.addOffFunc('click', (e,state) => $(`#info-popup-air`)
        .removeClass('mapinfo-anim-in')
        .addClass('mapinfo-anim-out'));



    // index related
    const secondaryMenuIndex = new SecondaryMenu('secondary-menu-index', SETUP.btnIndex, 1);
    secondaryMenuIndex.enableAnim();
    SETUP.btnIndex.addOffFunc('click', (e,state) => secondaryMenuIndex.forceTransition());

    const secondaryBtnIndexHover = new Button('btn-secondary-index-hover');
    secondaryBtnIndexHover.enableAnim();
    secondaryBtnIndexHover.addOnFunc('click', (e,state) => disablePopupIndex());
    secondaryBtnIndexHover.addOffFunc('click', (e,state) => enablePopupIndex());

    const secondaryBtnIndexLegend = new Button('btn-secondary-index-legend');
    secondaryBtnIndexLegend.enableAnim();
    secondaryBtnIndexLegend.addOnFunc('click', (e,state) => disableClickableLegendIndex());
    secondaryBtnIndexLegend.addOffFunc('click', (e,state) => enableClickableLegendIndex());

    
    const primaryInfoBtnIndex = new Button('btn-14');
    primaryInfoBtnIndex.enableAnim();
    primaryInfoBtnIndex.addOnFunc('click', (e,state) => $(`#info-popup-index`)
        .removeClass('mapinfo-anim-out')
        .addClass('mapinfo-anim-in'));
    primaryInfoBtnIndex.addOffFunc('click', (e,state) => $(`#info-popup-index`)
        .removeClass('mapinfo-anim-in')
        .addClass('mapinfo-anim-out'));
}

function initInfoPage()
{
    var buttons = [null,null,null,null,null,null];
    var prevShown = 5;
    var topZindex = 1; // max is quite alot, is okay to increment indefinitely

    const btn1 = new Button('btn-31');
    btn1.enableAnim();
    btn1.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-1', 0);
        if (prevShown != 1)
        {
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn1.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();

            prevShown = 1;
        }

        // prevShown = 1;
    });
    btn1.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-1', 0);
    });
    
    const btn2= new Button('btn-32');
    btn2.enableAnim();
    btn2.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-2', 0);
        $('.mapinfo-info-2').css('z-index', ++topZindex);
        if (prevShown != 2)
        {
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn2.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();
            
            prevShown = 2;
        }

        // prevShown = 2;
    });
    btn2.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-2', 0);
    });
    
    const btn3 = new Button('btn-33');
    btn3.enableAnim();
    btn3.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-3', 0);
        if (prevShown != 3)
        {
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn3.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();

            prevShown = 3;
        }

        // prevShown = 3;
    });
    btn3.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-3', 0);
    });
    
    const btn4 = new Button('btn-34');
    btn4.enableAnim();
    btn4.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-4', 0);
        if (prevShown != 4)
        {
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn4.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();

            prevShown = 4;
        }

        // prevShown = 4;
        console.log('in 4')
    });
    btn4.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, 'info-4', 0);
    });
    
    const btn5 = new Button('btn-35');
    btn5.enableAnim();
    btn5.addOnFunc('click', (e,state) => {
        console.log('in 5 on', prevShown)
        toggleMapInfo(state, 'info-5', 1);
        if (prevShown != 5)
        {
            console.log(5, prevShown)
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn5.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();

            prevShown = 5;
        }
    });
    btn5.addOffFunc('click', (e,state) => {
        console.log('in 5 off', prevShown)
        toggleMapInfo(state, 'info-5', 1);
        if (prevShown != 5)
        {
            console.log(5, prevShown)
            $(`#${buttons[prevShown].id}`).css('pointer-events', 'all');
            $(`#${btn5.id}`).css('pointer-events', 'none');
            buttons[prevShown].forceTransition();

            prevShown = 5;
        }

        // toggleMapInfo(state, 'info-5', 1);
    });

    buttons[1] = btn1;
    buttons[2] = btn2;
    buttons[3] = btn3;
    buttons[4] = btn4;
    buttons[5] = btn5;
}
