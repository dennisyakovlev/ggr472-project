const SETUP = {
    btnSites: null,
    btnWater: null,
    btnAir: null,
    btnIndex: null
};

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
}

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



    // air related
    const secondaryMenuAir = new SecondaryMenu('secondary-menu-air', SETUP.btnAir, 0);
    secondaryMenuAir.enableAnim();
    SETUP.btnAir.addOnFunc('click', (e,state) => secondaryMenuAir.forceTransition());

    const secondaryBtnAirHover = new Button('btn-secondary-air-hover');
    secondaryBtnAirHover.enableAnim();
    secondaryBtnAirHover.addOnFunc('click', (e,state) => disablePopupAir());
    secondaryBtnAirHover.addOffFunc('click', (e,state) => enablePopupAir());



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
}