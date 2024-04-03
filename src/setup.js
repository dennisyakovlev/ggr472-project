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
        toggleMapInfo(state, "sites", 0);
    });
    SETUP.btnSites.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, "sites", 0);

        forceSafeClearSitesHex();
        forceSafeClearSitesPoints();
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
        clearSitesPoints();
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



    const secondaryMenuAir = new SecondaryMenu('secondary-menu-air', SETUP.btnAir, 0);
    secondaryMenuAir.enableAnim();
    SETUP.btnAir.addOnFunc('click', (e,state) => secondaryMenuAir.forceTransition());

    const secondaryMenuWater = new SecondaryMenu('secondary-menu-water', SETUP.btnWater, 0);
    secondaryMenuWater.enableAnim();
    SETUP.btnWater.addOnFunc('click', (e,state) => secondaryMenuWater.forceTransition());
}