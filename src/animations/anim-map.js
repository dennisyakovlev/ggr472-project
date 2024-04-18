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
            map.setPaintProperty(this.targetId, 'circle-opacity', toOpacity);
            map.setPaintProperty(this.targetId, 'circle-stroke-opacity', toOpacity);
        }
    }
};

class MapPopup
{
    _init()
    {
        const popup = new mapboxgl.Popup({
            closeButton: false, // disable close button
            closeOnClick: false // disable close on click
        });
    
        map.on('mousemove', this.targetLayer, (e) => {
            if (this.mainTrans.getState('click')%2==1 &&
                this.secondTrans.getState('click')%2==0)
            {
                const features = e.features;
                // is on a feature of the layer ?
                if (features && features.length > 0)
                {
                    map.getCanvas().style.cursor = 'pointer';
    
                    const feature = features[0];
                    const centroid = turf.centroid(feature);
                    const coordinates = centroid.geometry.coordinates;
    
                    popup.setLngLat(coordinates).setHTML(this.func(feature)).addTo(map);
                }
                else
                {
                    map.getCanvas().style.cursor = '';
                    popup.remove();
                }
            }
        });
    
        map.on('mouseleave', this.targetLayer, (e) => {
            // always remove popup on layer exit
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    }

    constructor(mainTrans, secondTrans, targetLayer, func)
    {
        this.mainTrans   = mainTrans;
        this.secondTrans = secondTrans;
        this.targetLayer = targetLayer;
        this.func        = func;

        this._init();
    }

};
