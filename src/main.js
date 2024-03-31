mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";

const map = new mapboxgl.Map({
	container: 'my-map', // container ID
	style: 'mapbox://styles/dennisyakovlev40/clskppghq03u401p2c3184488', // my edited monochrone
	center: [-85.9, 50.7], // starting position [lng, lat], aim at NYC
	zoom: 4, // starting tile zoom
    pitch: 45
});

const DATA_NAME = {
    MAIN: 'data-main',
    SITES: 'data-sites',
    PLANTS: 'data-plants'
};

var DATA = {};
var fetched = 0;

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/data.geojson')
    .then(response => response.json())
    .then(response => {
        console.log('a')
        DATA[DATA_NAME.MAIN] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });


fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/contaminated_sites.geojson')
    .then(response => response.json())
    .then(response => {
        console.log('b')
        DATA[DATA_NAME.SITES] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/water_facilities.geojson')
    .then(response => response.json())
    .then(response => {
        console.log('c')
        DATA[DATA_NAME.PLANTS] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

function addData()
{
    // main data
    map.addSource(DATA_NAME.MAIN, {
        'type': 'geojson',
        'data': DATA[DATA_NAME.MAIN]
    });

    // contaminated sites
    map.addSource(DATA_NAME.SITES, {
        'type': 'geojson',
        'data': DATA[DATA_NAME.SITES]
    });

    // treatment plants
    map.addSource(DATA_NAME.PLANTS, {
        'type': 'geojson',
        'data': DATA[DATA_NAME.PLANTS]
    });
}

function addLayers()
{
    // main data
    var dataFill = map.addLayer({
        'id': 'data-layer',
        'type': 'fill',
        'source': DATA_NAME.MAIN,
        'layout': {},
        'paint': {
            'fill-color': 'red'
        }
    });
    var dataBorders = map.addLayer({
        'id': 'data-border',
        'type': 'line',
        'source': DATA_NAME.MAIN,
        'layout': {},
        'paint': {
            'line-color': 'blue'
        }
    });

    // contaimated sites
    var sitesCircle = map.addLayer({
        'id': 'sites-layer',
        'type': 'circle',
        'source': DATA_NAME.SITES,
        'paint': {
            'circle-color': 'purple'
        }
    });

    // treatment plants
    var plantsCircle = map.addLayer({
        'id': 'plants-layer',
        'type': 'circle',
        'source': DATA_NAME.PLANTS,
        'paint': {
            'circle-color': 'orange'
        }
    });
}

function dataParse(data)
{
    const features = turf.featureCollection(data.features);
    const bbox = turf.envelope(features);
    const poly = turf.polygon(bbox.geometry.coordinates);
    const bboxTrans = turf.transformScale(poly.geometry, 1.2);
    const newBbox = turf.envelope(bboxTrans);
    const hexGrid = turf.hexGrid(newBbox.bbox, 50, 'kilometers');
    const collected = turf.collect(hexGrid, data, "FederalSiteIdentifier", "values")

    return collected
}

function addHexGrid()
{
    // const processedData = dataParse();
}

function loadingRemove()
{
    $('.loader').css('animation', 'l15 1s infinite linear, loader-key-anim-out 1s forwards ease-in');
    $('#screen-2').addClass('screen-anim-in');
}

map.on("load", () => {
    map.addControl(new mapboxgl.NavigationControl()); // add nav controls

    var count = 0;
    var dontQuit = false;
    const timer = setInterval(function() {
        console.log(fetched)
        if (fetched == 3 && dontQuit == false)
        {
            dontQuit = true;

            addData();
            addLayers();
            addHexGrid();

            console.log('READY')
            setTimeout(e => loadingRemove(), 1000);

            clearInterval(timer);
        }
        if (count == 28 && dontQuit == false)
        {
            loadFail();
            clearInterval(timer);
        }
        count += 1;
    }, 250);
});

$(document).ready(function() {
    const menu = new Menu('menu-1');
    menu.enableAnim();

    const btn1 = new Button('btn-2');
    btn1.enableAnim();
})
