mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";
const map = new mapboxgl.Map({
	container: 'my-map',                       // container ID
	style: 'mapbox://styles/mapbox/light-v11', // my edited monochrone
	center: [-85.9, 50.7],                     // starting position [lng, lat], aim at NYC
	zoom: 4,                                   // starting tile zoom
    pitch: 0                                   // no pitch
});

/*  global names for each layer
*/
const DATA_NAME = {
    MAIN: 'main',
    sites: 'sites',
    water: 'water',
    air: 'air',
    SOCIO: 'socio'
};
/*  helper function for getting names of certain items
*/
function dataName(str)
{
    return `${str}-data`;
}
function layerName(str)
{
    return `${str}-layer`;
}
function borderName(str)
{
    return `${str}-border`;
}

let DATA = {}; // global data variable of fetched files

/*  toggle extras related to some layer on and off

    state       - state from animatable
    targetClass - class of dom elements to target
    stateOffset - 0 for normal, 1 for reversed
*/
function toggleMapInfo(state, targetClass, stateOffset)
{
    const elems = $(`.mapinfo-${targetClass}`);
    if ((state+stateOffset)%2==1) // 1 => turn on
    {
        $(elems)
            .removeClass('mapinfo-anim-out')
            .addClass('mapinfo-anim-in');
    }
    else // 0 => turn off
    {
        $(elems)
            .removeClass('mapinfo-anim-in')
            .addClass('mapinfo-anim-out');
    }
}

/*  get the currenet map view as a feature
*/
function getScreenAsFeature()
{
    const obj = map.getBounds();
    const sw = turf.feature({
        'type': 'Point',
        'coordinates': [obj._sw.lng, obj._sw.lat]
    });
    const ne = turf.feature({
        'type': 'Point',
        'coordinates': [obj._ne.lng, obj._ne.lat]
    });
    return {'features': [sw, ne]};
}

/*  round number to n decimals
*/
function roundDec(num, to)
{
    return Math.round(num * Math.pow(10, to)) / Math.pow(10, to);
}