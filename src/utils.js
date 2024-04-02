mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";
const map = new mapboxgl.Map({
	container: 'my-map', // container ID
	style: 'mapbox://styles/dennisyakovlev40/clskppghq03u401p2c3184488', // my edited monochrone
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
