/* colors of chloropleth
*/
const indexColors = ['FEE5D9', 'FCAE91', 'FB6A4A', 'DE2D26', 'A50F15'];
/* simulated namespace for index file
*/
const INDEX = {
    isOn: true,             // is the index layer on
    isPopupEnabled: true,   // is hover popup enabled
    isLegendEnabled: true,  // is the legend for the layer on
    fill: {
        _value: [           // base fill value for layer
            'case',
            ['<=', ['get', 'Combined_Risk_Score'], 8], '#',
            ['<=', ['get', 'Combined_Risk_Score'], 11], '#',
            ['<=', ['get', 'Combined_Risk_Score'], 13], '#',
            ['<=', ['get', 'Combined_Risk_Score'], 15], '#',
            ['<=', ['get', 'Combined_Risk_Score'], 20], '#',
            'blue'
        ],
        _colors: structuredClone(indexColors)
    }
};

/*  take the base fill and actually fill in the colors
    using the current colors
*/
function buildIndexColorValue()
{
    const val = structuredClone(INDEX.fill._value);
    for (var i=0; i!=INDEX.fill._colors.length; ++i)
    {
        val[2*(i+1)] = `#${INDEX.fill._colors[i]}`;
    }
    return val;
}
/*  update color used to display the chrlopleth
*/
function updateIndexColor(ind, col)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    INDEX.fill._colors[ind] = col;
}
/* get color used to display the chrloropleth
*/
function getIndexColor(ind)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    return INDEX.fill._colors[ind];
}

/*  make the chrolopleth visible on the map
*/
function genIndexPoly()
{
    INDEX.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 1);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 1);
}
/*  make the chrlopleth invisble on the map
*/
function clearIndexPoly()
{
    INDEX.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-opacity', 0);
    map.setPaintProperty(borderName(DATA_NAME.MAIN), 'line-opacity', 0);
}

/*  create the html string used to fill in the
    on hover popup
*/
function createPopupHTMLIndex(feature)
{
    const prop = feature.properties;

    return  `
            <h2>Environmental Risk</h2>
            <p>Census Subdivision Name: ${prop['Census subdivision name']}</p>
            <p>Average PM2.5 Concentration: ${Math.round(parseFloat(prop['Average PM2.5 concentration']) * 100) / 100}</p>
            <p>Number of Active Contaminated Sites: ${prop['Number of active contaminated sites']}</p>
            <p>Water Quality Score: ${prop['Risk score_MEAN NITROGEN (nitrogen + nitrite)'] + prop['Risk score_MEAN TOTAL PHOSPHORUS']}</p>
            <p>Mean Phosphorus: ${prop['Risk score_MEAN TOTAL PHOSPHORUS']}</p>
            <p>Risk Score: ${prop['Combined_Risk_Score']}</p>
            `;
}

/*  make the on hover popup fucntionality work
*/
function enablePopupIndex()
{
    INDEX.isPopupEnabled = true;
}
/*  disable on hover popup funcationality
*/
function disablePopupIndex()
{
    INDEX.isPopupEnabled = false;
}

/*  make the corresponding legend for the index interactive
*/
function enableClickableLegendIndex()
{
    INDEX.isLegendEnabled = true;
    $('.legend-index-pic').addClass('pointer');
}
/*  make the corresponding lengend for the index static
*/
function disableClickableLegendIndex()
{
    INDEX.isLegendEnabled = false;
    $('.legend-index-pic').removeClass('pointer');
}

map.on('load', () => {
    // on hover pop ups
    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', layerName(DATA_NAME.MAIN), (e) => {
        if (INDEX.isOn && INDEX.isPopupEnabled)
        {
            const features = e.features;
            // is on a feature of the layer ?
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
        // always remove popup on layer exit
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // interacitve legend
    $('#legend-index').on('click', (e) => {
        const id = $(e.target).attr('id');
        if (id && INDEX.isLegendEnabled)
        {
            if (id.match(/^legend-index-pic-[0-9]$/g))
            {
                const ind = parseInt(id.slice(-1));
                const col = getIndexColor(ind) == 'a9a9a9'
                    ? indexColors[ind]  // bring in
                    : 'a9a9a9';         // grey out

                updateIndexColor(ind, col);
                map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-color', buildIndexColorValue());
                
                $(e.target).css({'background-color': `#${col}`});
            }
        }
    });
});
