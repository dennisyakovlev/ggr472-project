var INDEX = {
    isOn: true
};

function genIndexPoly()
{
    INDEX.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 1);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 1);
}

function clearIndexPoly()
{
    INDEX.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 0);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 0);
}

function createPopupHTMLIndex(feature)
{
    const prop = feature.properties;

    return  `
            <h2>Index Census Subdivision</h2>
            <p>Census Subdivision Name: ${prop['Census subdivision name']}</p>
            <p>Average PM2.5 Concentration: ${Math.round(parseFloat(prop['Average PM2.5 concentration']) * 100) / 100}</p>
            <p>Number of Active Contaminated Sites: ${prop['Number of active contaminated sites']}</p>
            <p>Water Quality Score: ${prop['Risk score_MEAN NITROGEN (nitrogen + nitrite)'] + prop['Risk score_MEAN TOTAL PHOSPHORUS']}</p>
            <p>Contaminated Sites Risk Score: ${prop['Risk score_Number of active contaminated sites']}</p>
            <p>Risk Score: ${prop['Combined_Risk_Score']}</p>
            `;
}

map.on('load', () => {
    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', layerName(DATA_NAME.MAIN), (e) => {
        if (INDEX.isOn)
        {
            const features = e.features;
            if (features && features.length > 0)
            {
                map.getCanvas().style.cursor = 'pointer';

                const feature = features[0];
                const centroid = turf.centroid(feature);
                const coordinates = centroid.geometry.coordinates;

                popup.setLngLat(coordinates).setHTML(createPopupHTMLIndex(feature)).addTo(map);
            }
            else
            {
                map.getCanvas().style.cursor = '';
                popup.remove();
            }
        }
    });

    map.on('mouseleave', layerName(DATA_NAME.MAIN), (e) => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
