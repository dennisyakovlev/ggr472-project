const SETUP = {
    btnIndex: null
};

function initMap()
{
    /* set up main menu for switching between different map layers */
    const mainMenu = new Menu('menu-btn-main');
    mainMenu.enableAnim();

    const btnSites = new Button('btn-1');
    btnSites.enableAnim();
    btnSites.addOnFunc('click', (e,state) => {
        toggleMapInfo(state, "sites", 0);
    });
    btnSites.addOffFunc('click', (e,state) => {
        toggleMapInfo(state, "sites", 0);

        forceSafeClearSitesHex();
        forceSafeClearSitesPoints();
    });

    const btnWater = new Button('btn-2');
    btnWater.enableAnim();
    btnWater.addOnFunc('click', (e,state) => {
        genWaterPoint();
    });
    btnWater.addOffFunc('click', (e,state) => {
        clearWaterPoint();
    });

    const btnAir = new Button('btn-3a');
    btnAir.enableAnim();
    btnAir.addOnFunc('click', (e,state) => {
        genAirPoints();
    });
    btnAir.addOffFunc('click', (e,state) => {
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
    const secondaryMenuIndex = new SecondaryMenu('secondary-menu-index', SETUP.btnIndex, 0);
    secondaryMenuIndex.enableAnim();
}