/*
    have object associated with second menu
        - is given ids which correspond to clickable buttons
        - 
        - (ie attach to nth transitionable)
*/

class MapAnimatable extends Animatable
{
};


class MapPoints extends MapAnimatable
{
    constructor({
        targetId           = null,
        congrouenceClasses = null,
        source             = null,
        fill               = 'black',
        radius             = 5,
        border_color       = 'red',
        border_width       = 2,
        duration           = 250
    }={})
    {
        super(targetId, congrouenceClasses);

        console.assert(source != null);
        this.source = source;
        
        map.addLayer({
            id:     this.targetId,
            type:   'circle',
            source: this.source,
            paint: {
                'circle-color':                     fill,
                'circle-opacity':                   0,
                'circle-radius':                    radius,
                'circle-stroke-width':              border_width,
                'circle-stroke-color':              border_color,
                'circle-stroke-opacity':            0,
                'circle-opacity-transition':        { duration: duration },
                'circle-stroke-opacity-transition': { duration: duration }
            }
        })
    }

    transition(type, congClass)
    {
        if (type != 'click')
            throw new Error(`type [${type}] should be click`);

        const toOpacity = congClass == this.congClasses[0]
            ? 1
            : congClass == this.congClasses[1]
                ? 0
                : -1;
        
        if (toOpacity != -1)
        {
            map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-opacity', toOpacity);
            map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-stroke-opacity', toOpacity);
        }
    }
};

class MapPopup extends MapAnimatable
{
    constructor({
        targetId           = null,
        congrouenceClasses = null})
    {
        super(targetId, congrouenceClasses);
    }

    transition(type, congClass)
    {
        console.log('HEREs')
    }
};

// ... boundary, fill, point, etc.