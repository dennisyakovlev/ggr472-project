const WATER = {
    isOn: false,
    isPopupEnabled: true,
    isAreaEffectEnable: true
};

function waterDisplayLayerName()
{
    return `${layerName(DATA_NAME.WATER)}-extra`;
}

function genWaterPoint()
{
    WATER.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-stroke-opacity', 1);
}
function clearWaterPoint()
{
    WATER.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.WATER), 'circle-stroke-opacity', 0);
}

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
            if (features && features.length > 0)
            {
                const prop = features[0].properties;

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
                map.setPaintProperty(waterDisplayLayerName(DATA_NAME.WATER), 'fill-color', 'transparent');
                map.setPaintProperty(borderName(waterDisplayLayerName(DATA_NAME.WATER)), 'line-color', 'transparent');
                map.getCanvas().style.cursor = '';
            }
        }

        if (WATER.isOn && WATER.isPopupEnabled)
        {
            const features = e.features;
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
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(waterDisplayLayerName(DATA_NAME.WATER), 'fill-color', 'transparent');
        map.setPaintProperty(borderName(waterDisplayLayerName(DATA_NAME.WATER)), 'line-color', 'transparent');
    
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
