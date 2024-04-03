mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";
const map = new mapboxgl.Map({
	container: 'my-map', // container ID
	style: 'mapbox://styles/mapbox/light-v11', // my edited monochrone
	center: [-85.9, 50.7], // starting position [lng, lat], aim at NYC
	zoom: 4, // starting tile zoom
    pitch: 0
});

const DATA_NAME = {
    MAIN: 'main',
    SITES: 'sites',
    PLANTS: 'plants'
};
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

var DATA = {};

function generateHexGrid(bbox, data, hexSize, field)
{
    const hexGrid = turf.hexGrid(bbox, hexSize, 'kilometers');
    const collected = turf.collect(hexGrid, data, field, "values");

    return collected;
}
function getBoundingBoxfromData(data, scale)
{
    const features = turf.featureCollection(data.features);
    const bbox = turf.envelope(features);
    const poly = turf.polygon(bbox.geometry.coordinates);
    const bboxTrans = turf.transformScale(poly.geometry, scale);
    const newBbox = turf.envelope(bboxTrans);

    return newBbox.bbox;
}

/*  state - state from animatable
    targetClass - class of dom elements to target
    stateOffset - 0 for normal, 1 for reversed
*/
function toggleMapInfo(state, targetClass, stateOffset)
{
    const elems = $(`.mapinfo-${targetClass}`);
    if ((state+stateOffset)%2==1) // 1 => turn on
    {
        for (var i=0; i!=elems.length; ++i)
        {
            $(elems[i])
                .removeClass('mapinfo-anim-out')
                .addClass('mapinfo-anim-in');
        }
    }
    else // 0 => turn off
    {
        for (var i=0; i!=elems.length; ++i)
        {
            $(elems[i])
                .removeClass('mapinfo-anim-in')
                .addClass('mapinfo-anim-out');
        }
    }
}
