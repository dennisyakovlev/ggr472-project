/*
*/
const WATER = {
    isOn: false,
    isPopupEnabled: true,
    isAreaEffectEnable: true
};

/*
*/
function waterDisplayLayerName()
{
    return `${layerName(DATA_NAME.WATER)}-extra`;
}

/*  make water layer visible on map
*/
function genWaterPoint()
{
    WATER.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-stroke-opacity', 1);
}
/*  map water layer invisible on map
*/
function clearWaterPoint()
{
    WATER.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-stroke-opacity', 0);
}

/*  create the html string used to fill in the
    on hover popup
*/
function createPopupHTMLWater(feature)
{
    const prop = feature.properties;

    return  `
            <h2>Water Quality Measuring Station</h2>
            <p>Name: ${prop['Name of water treatment facility']}</p>
            <p>Average Nitrogen Levels: ${prop['Average nitrogen levels']}</p>
            <p>Average Phosphorus Levels: ${prop['Average phosphorus levels']}</p>
            `;
}

/*  helper fucntions for enablding/disabling water layer
    interactivity
*/
function enablePopupWater()
{
    WATER.isPopupEnabled = true;
}
function disablePopupWater()
{
    WATER.isPopupEnabled = false;
}

function enableAreaEffectWater()
{
    WATER.isAreaEffectEnable = true;
}
function disableAreaEffectWater()
{
    WATER.isAreaEffectEnable = false;
}

map.on('load', () => {
    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', layerName(DATA_NAME.WATER), (e) => {
        if (WATER.isOn && WATER.isAreaEffectEnable)
        {
            const features = e.features;
            // is on a feature of the layer ?
            if (features && features.length > 0)
            {
                // 
                const prop = features[0].properties;

                // highlight the hovered over water facility coverage area
                map.getCanvas().style.cursor = 'pointer';
                map.setPaintProperty(
                    waterDisplayLayerName(DATA.WATER),
                    'fill-color',
                    [
                        'case',
                        ['==', ['get', 'Water facility name'], `${prop['Name of water treatment facility']}`], '#81d4fa',
                        'transparent'
                    ]);
                map.setPaintProperty(
                    borderName(waterDisplayLayerName(DATA.WATER)),
                    'line-color',
                    [
                        'case',
                        ['==', ['get', 'Water facility name'], `${prop['Name of water treatment facility']}`], 'black',
                        'transparent'
                    ]);
            }
            else
            {
                // stopped hovering over treatment plant point, hide highlighted
                map.setPaintProperty(waterDisplayLayerName(DATA_NAME.WATER), 'fill-color', 'transparent');
                map.setPaintProperty(borderName(waterDisplayLayerName(DATA_NAME.WATER)), 'line-color', 'transparent');
                map.getCanvas().style.cursor = '';
            }
        }

        if (WATER.isOn && WATER.isPopupEnabled)
        {
            const features = e.features;
            // is on a feature of the layer ?
            if (features && features.length > 0)
            {
                map.getCanvas().style.cursor = 'pointer';

                const feature = features[0];
                const centroid = turf.centroid(feature);
                const coordinates = centroid.geometry.coordinates;

                popup.setLngLat(coordinates).setHTML(createPopupHTMLWater(feature)).addTo(map);
            }
            else
            {
                map.getCanvas().style.cursor = '';
                popup.remove();
            }
        }
    });

    map.on('mouseleave', layerName(DATA_NAME.WATER), (e) => {
        // left layer, always remove highlighted coverage area and popup
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(waterDisplayLayerName(DATA_NAME.WATER), 'fill-color', 'transparent');
        map.setPaintProperty(borderName(waterDisplayLayerName(DATA_NAME.WATER)), 'line-color', 'transparent');
    
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
