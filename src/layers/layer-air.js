/*  simulated index for air file
*/
const AIR = {
    isOn: false,
    isPopupEnabled: true,
};

/*  make the air points layer visible on the map
*/
function genAirPoints()
{
    AIR.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-stroke-opacity', 1);
}
/*  make the air points layer invisble layer on the map
*/
function clearAirPoints()
{
    AIR.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.AIR), 'circle-stroke-opacity', 0);
}

/*  create the html string used to fill in the
    on hover popup
*/
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

/*  make the on hover popup funcaitonality work
*/
function enablePopupAir()
{
    AIR.isPopupEnabled = true;
}
/*  disable the on hover popup funcationality work
*/
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
            // is on a feature of the layer ?
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
        // always remove popup on layer exit
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
