/* colors of chloropleth
*/
const socioColors = ['FEE5D9', 'FCAE91', 'FB6A4A', 'DE2D26', 'A50F15']; // CHANE ??
/* simulated namespace for sociodemographic file
*/
const SOCIO = {
    isOn: false,             // is the socio layer on
    isPopupEnabled: true,   // is hover popup enabled
    isLegendEnabled: true,  // is the legend for the layer on
    fill: {
        _value: [           // base fill value for layer
            'case',
            ['<=', ['get', 'total_immi_prop'], 20], '#', // CHANGE ??? 
            ['<=', ['get', 'total_immi_prop'], 40], '#',
            ['<=', ['get', 'total_immi_prop'], 60], '#',
            ['<=', ['get', 'total_immi_prop'], 80], '#',
            ['<=', ['get', 'total_immi_prop'], 100], '#',
            '#a9a9a9'
        ],
        _colors: structuredClone(socioColors)
    }
};

/*  take the base fill and actually fill in the colors
    using the current colors
*/
function buildSocioColorValue()
{
    const val = structuredClone(SOCIO.fill._value);
    for (let i=0; i!=SOCIO.fill._colors.length; ++i)
    {
        val[2*(i+1)] = `#${SOCIO.fill._colors[i]}`;
    }
    return val;
}
/*  update color used to display the chrlopleth
*/
function updateSocioColor(ind, col)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    SOCIO.fill._colors[ind] = col;
}
/* get color used to display the chrloropleth
*/
function getSocioColor(ind)
{
    if (!(0 <= ind && ind <= 4)) throw new Error('bad color');

    return SOCIO.fill._colors[ind];
}

/*  make the chrolopleth visible on the map
*/
function genSocioPoly()
{
    SOCIO.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.SOCIO), 'fill-opacity', 1);
    map.setPaintProperty(borderName(DATA_NAME.SOCIO), 'line-opacity', 1);
}
/*  make the chrlopleth invisble on the map
*/
function clearSocioPoly()
{
    SOCIO.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.SOCIO), 'fill-opacity', 0);
    map.setPaintProperty(borderName(DATA_NAME.SOCIO), 'line-opacity', 0);
}

/*  create the html string used to fill in the
    on hover popup
*/
function createPopupHTMLSocio(feature)
{
    const prop = feature.properties;

    return  `
            <h2>Socio Demographic Data</h2>
            <p>Census Subdivision Name: ${prop['CSDNAME']}</p>
            <p>Visible Minority Proportion: ${roundDec(prop['visible_minority_prop'],2)}</p>
            <p>CHANGE: ${roundDec(prop['total_immi_prop'],2)}</p>
            `;
}

/*  make the on hover popup fucntionality work
*/
function enablePopupSocio()
{
    SOCIO.isPopupEnabled = true;
}
/*  disable on hover popup funcationality
*/
function disablePopupSocio()
{
    SOCIO.isPopupEnabled = false;
}

/*  make the corresponding legend for the socio interactive
*/
function enableClickableLegendSocio()
{
    SOCIO.isLegendEnabled = true;
    $('.legend-socio-pic').addClass('pointer');
}
/*  make the corresponding lengend for the socio static
*/
function disableClickableLegendSocio()
{
    SOCIO.isLegendEnabled = false;
    $('.legend-socio-pic').removeClass('pointer');
}

map.on('load', () => {
    // on hover pop ups
    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', layerName(DATA_NAME.SOCIO), (e) => {
        if (SOCIO.isOn && SOCIO.isPopupEnabled)
        {
            const features = e.features;
            // is on a feature of the layer ?
            if (features && features.length > 0)
            {
                map.getCanvas().style.cursor = 'pointer';

                const feature = features[0];
                const centroid = turf.centroid(feature);
                const coordinates = centroid.geometry.coordinates;

                popup.setLngLat(coordinates).setHTML(createPopupHTMLSocio(feature)).addTo(map);
            }
            else
            {
                map.getCanvas().style.cursor = '';
                popup.remove();
            }
        }
    });

    map.on('mouseleave', layerName(DATA_NAME.SOCIO), (e) => {
        // always remove popup on layer exit
        map.getCanvas().style.cursor = '';
        popup.remove();
    });

    // interacitve legend
    $('#legend-socio').on('click', (e) => {
        const id = $(e.target).attr('id');
        if (id && SOCIO.isLegendEnabled)
        {
            if (id.match(/^legend-socio-pic-[0-9]$/g))
            {
                const ind = parseInt(id.slice(-1));
                const col = getSocioColor(ind) == 'a9a9a9'
                    ? socioColors[ind]  // bring in
                    : 'a9a9a9';         // grey out

                updateSocioColor(ind, col);
                map.setPaintProperty(layerName(DATA_NAME.SOCIO), 'fill-color', buildSocioColorValue());
                
                $(e.target).css({'background-color': `#${col}`});
            }
        }
    });
});
