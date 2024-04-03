function initMap()
{
    /* set up main menu for switching between different map layers */
    const mainMenu = new Menu('menu-btn-main');
    mainMenu.enableAnim();

    const btnSites = new Button('btn-1');
    btnSites.enableAnim();
    btnSites.addOnFunc((e,state) => {
        toggleMapInfo(state, "sites", 0);
    });
    btnSites.addOffFunc((e,state) => {
        toggleMapInfo(state, "sites", 0);

        forceSafeClearSitesHex();
        forceSafeClearSitesPoints();
    });

    const btnTreatment = new Button('btn-2');
    btnTreatment.enableAnim();
    btnTreatment.addOnFunc((e,state) => {

    });
    btnTreatment.addOffFunc((e,state) => {

    });

    const btnAir = new Button('btn-3a');
    btnAir.enableAnim();
    btnAir.addOnFunc((e,state) => {

    });
    btnAir.addOffFunc((e,state) => {

    });

    const btnIndex = new Button('btn-3');
    btnIndex.enableAnim();
    btnIndex.addOnFunc((e,state) => {
        toggleMapInfo(state, 'index', 1);

        forceSafeClearIndexPoly();
    });
    btnIndex.addOffFunc((e,state) => {
        toggleMapInfo(state, 'index', 1);

        genIndexPoly();
    });

}