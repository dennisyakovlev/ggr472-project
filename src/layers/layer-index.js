const indexColors = ['FEE5D9', 'FCAE91', 'FB6A4A', 'DE2D26', 'A50F15']
const INDEX = {
    isOn: true,
    isPopupEnabled: true,
    isLegendEnabled: true,
    fill: {
        _value: [
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

function buildIndexColorValue()
{
    const val = structuredClone(INDEX.fill._value);
    for (var i=0; i!=INDEX.fill._colors.length; ++i)
    {
        val[2*(i+1)] = `#${INDEX.fill._colors[i]}`;
    }
    return val;
}
function updateIndexColor(ind, col)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    INDEX.fill._colors[ind] = col;
}
function getIndexColor(ind)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    return INDEX.fill._colors[ind];
}

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

function enablePopupIndex()
{
    INDEX.isPopupEnabled = true;
}
function disablePopupIndex()
{
    INDEX.isPopupEnabled = false;
}

function enableClickableLegendIndex()
{
    INDEX.isLegendEnabled = true;
    $('.legend-index-pic').addClass('pointer');
}
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

    // filtering
    $('#legend-index').on('click', (e) => {
        const id = $(e.target).attr('id');
        if (id && INDEX.isLegendEnabled)
        {
            if (id.match(/^legend-index-pic-[0-9]$/g))
            {
                const ind = parseInt(id.slice(-1));
                const col = getIndexColor(ind) == 'a9a9a9'
                    ? indexColors[ind]
                    : 'a9a9a9';

                updateIndexColor(ind, col);
                map.setPaintProperty(layerName(DATA_NAME.MAIN), 'fill-color', buildIndexColorValue());
                
                $(e.target).css({'background-color': `#${col}`});
            }
        }
    });
});
