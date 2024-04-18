/*
    have object associated with second menu
        - is given ids which correspond to clickable buttons
        - 
        - (ie attach to nth transitionable)
*/

const ORIGINAL_COLOR = 'ORIGINAL';

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
        
        map.addLayer({
            id:     this.targetId,
            type:   'circle',
            source: source,
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

class MapChloropleth extends MapAnimatable
{
    _verifyIntervals()
    {
        let prev = this.intervals[0];
        for (let i=1; i!=this.intervals.length; ++i)
        {
            if (prev >= this.intervals[i])
            {
                throw new Error(`intervals [${this.intervals}] must be strictly increasing`);
            }

            prev = this.intervals[i];
        }
    }

    _verifyColors()
    {
        if (this.intervals.length != this.origFillColors.length)
            throw new Error(`length mismatch, should be same`);
    }

    _generateExpression()
    {
        let expr = ['case'];
        for (let i=0; i!=this.currFillColors.length; ++i)
        {
            expr.push(['<=', ['get', this.fillVariable], this.intervals[i]]);
            expr.push(this.currFillColors[i]);
        }
        expr.push('transparent');

        return expr;
    }

    constructor({
        targetId           = null,
        congrouenceClasses = null,
        secondaryTargetId  = null,
        source             = null,
        fillVariable       = null,
        fillColors         = null,
        intervals          = null,
        border_color       = 'red',
        border_width       = 2,
        duration           = 250
    }={})
    {
        super(targetId, congrouenceClasses);

        this.secondaryTargetId = secondaryTargetId;
        this.fillVariable      = fillVariable;
        this.origFillColors    = structuredClone(fillColors);
        this.currFillColors    = structuredClone(fillColors);
        this.intervals         = structuredClone(intervals);
        this._verifyIntervals();
        this._verifyColors();

        // main chloropleth index data
        map.addLayer({
            'id': this.targetId,
            'type': 'fill',
            'source': source,
            'layout': {},
            'paint': {
                'fill-color'             : this._generateExpression(),
                'fill-opacity'           : 0,
                'fill-opacity-transition': { duration: duration }
            }
        });
        map.addLayer({
            'id': this.secondaryTargetId,
            'type': 'line',
            'source': source,
            'layout': {},
            'paint': {
                'line-color'             : border_color,
                'line-width'             : border_width,
                'line-opacity'           : 0,
                'line-opacity-transition': { duration: duration }
            }
        });
    }

    transition(type, congClass)
    {
        if (type != 'click')
            throw new Error(`type [${type}] should be click`);

        const toOpacity = congClass == this.congClasses[0]
            ? 0.6
            : congClass == this.congClasses[1]
                ? 0
                : -1;
        
        if (toOpacity != -1)
        {
            map.setPaintProperty(this.targetId, 'fill-opacity', toOpacity);
            map.setPaintProperty(this.secondaryTargetId, 'line-opacity', toOpacity);
        }
    }

    numIntervals()
    {
        return this.intervals.length;
    }

    setColor(index, color)
    {
        this.currFillColors[index] = color == ORIGINAL_COLOR
            ? this.origFillColors[index]
            : color;
    }

    render()
    {
        map.setPaintProperty(this.targetId, 'fill-color', this._generateExpression());
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

class LegenedItem extends StaticHiglightable
{
    constructor(targetId, congrouenceClasses, mapPoly)
    {
        super(targetId, congrouenceClasses);

        this.mapPoly = mapPoly;
        this.index   = parseInt(/[0-9]+$/.exec(this.targetId));
    }

    transition(type, congClass)
    {
        super.transition(type, congClass);
        
        if (congClass == this.congClasses[1]) // on
        {
            this.mapPoly.setColor(this.index, ORIGINAL_COLOR);
            this.mapPoly.render();
        }
        if (congClass == this.congClasses[0]) // off
        {
            this.mapPoly.setColor(this.index, '#a9a9a9');
            this.mapPoly.render();
        }
    }
};