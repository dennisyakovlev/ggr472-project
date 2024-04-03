const AIR = {
    isOn: false,
    isPopupEnabled: true,
};

function genAirPoints()
{
    AIR.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-stroke-opacity', 1);
}
function clearSitesPoints()
{
    AIR.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-stroke-opacity', 0);
}

function createPopupHTMLAir(feature)
{
    const prop = feature.properties;

    return  `
            <h2>Air Quality Measuring Station</h2>
            <p>City: ${prop['City']}</p>
            <p>Average PM2.5 Concentration: ${prop['Average PM2.5 Concentration in 2022']}</p>
            <p>Location: ${prop['Location of Air Monitoring Station']}</p>
            `;
}

function enablePopupAir()
{
    AIR.isPopupEnabled = true;
}
function disablePopupAir()
{
    AIR.isPopupEnabled = false;
}

map.on('load', () => {
    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', layerName(DATA_NAME.AIR), (e) => {
        if (AIR.isOn && AIR.isPopupEnabled)
        {
            const features = e.features;
            if (features && features.length > 0)
            {
                map.getCanvas().style.cursor = 'pointer';

                const feature = features[0];
                const centroid = turf.centroid(feature);
                const coordinates = centroid.geometry.coordinates;

                popup.setLngLat(coordinates).setHTML(createPopupHTMLAir(feature)).addTo(map);
            }
            else
            {
                map.getCanvas().style.cursor = '';
                popup.remove();
            }
        }
    });

    map.on('mouseleave', layerName(DATA_NAME.AIR), (e) => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});