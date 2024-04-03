var WATER = {
    isOn: false
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

map.on('load', () => {
    map.on('mousemove', layerName(DATA_NAME.WATER), (e) => {
        if (WATER.isOn)
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
    });

    map.on('mouseleave', layerName(DATA_NAME.WATER), (e) => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(waterDisplayLayerName(DATA_NAME.WATER), 'fill-color', 'transparent');
        map.setPaintProperty(borderName(waterDisplayLayerName(DATA_NAME.WATER)), 'line-color', 'transparent');
    });
});
