/*  state - state from animatable
    targetClass - class of dom elements to target
    stateOffset - 0 for normal, 1 for reversed
*/
function toggleMapInfo(state, targetClass, stateOffset)
{
    const elems = $(`.mapinfo-${targetClass}`);
    if ((state+stateOffset)%2==1) // 1 => turn on
    {
        for (var i=0; i!=elems.length; ++i)
        {
            $(elems[i])
                .removeClass('mapinfo-anim-out')
                .addClass('mapinfo-anim-in');
        }
    }
    else // 0 => turn off
    {
        for (var i=0; i!=elems.length; ++i)
        {
            $(elems[i])
                .removeClass('mapinfo-anim-in')
                .addClass('mapinfo-anim-out');
        }
    }
}

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
    btnSites.addOffFunc((e,states) => {
        toggleMapInfo(states, "sites", 0);

        forceSafeClearSitesHex();
        forceSafeClearSitesPoints();
    });
    const btnTreatment = new Button('btn-2');
    btnTreatment.enableAnim();
    btnTreatment.addOnFunc((e,state) => {

    });
    btnTreatment.addOffFunc((e,states) => {

    });
    const btnIndex = new Button('btn-3');
    btnIndex.enableAnim();
    btnIndex.addOnFunc((e,state) => {

    });
    btnIndex.addOffFunc((e,states) => {

    });
    const btnAir = new Button('btn-3a');
    btnAir.enableAnim();
    btnAir.addOnFunc((e,state) => {

    });
    btnAir.addOffFunc((e,states) => {

    });

}