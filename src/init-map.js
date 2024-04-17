function initMap()
{
    const layer = new MapPoints({
        targetId           : layerName(DATA_NAME.AIR),
        congrouenceClasses : [0,1],
        source             : dataName(DATA_NAME.AIR),
        fill               : '#01579b',
        radius             : 5,
        border_color       : 'white',
        border_width       : 1,
        duration           : 250
    });
    const popUps = new MapPopup({
        targetId           : layerName(DATA_NAME.AIR),
        congrouenceClasses : [0]
    });

    const trigger = createTrigger('trigger-secondary-air', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const mapTrigger = createTrigger('trigger-nav-env', 2);
    mapTrigger.addAnimElem({type: 'over', anim: popUps});
}