var fetched = 0;

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/data.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.MAIN)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/contaminated_sites.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.SITES)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/water_facilities.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.WATER)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });


fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/pollution.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.AIR)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

function addData()
{
    // main data
    map.addSource(dataName(DATA_NAME.MAIN), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.MAIN)]
    });

    // contaminated sites
    map.addSource(dataName(DATA_NAME.SITES), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.SITES)]
    });

    // treatment WATER
    map.addSource(dataName(DATA_NAME.WATER), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.WATER)]
    });

    // air monitoring
    map.addSource(dataName(DATA_NAME.AIR), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.AIR)]
    });
}

function addLayers()
{
    // main chloropleth index data
    map.addLayer({
        'id': layerName(DATA_NAME.MAIN),
        'type': 'fill',
        'source': dataName(DATA_NAME.MAIN),
        'layout': {},
        'paint': {
            'fill-color': buildIndexColorValue(),
            'fill-opacity': 1,
            'fill-opacity-transition': { duration: 250 }
        }
    });
    map.addLayer({
        'id': borderName(DATA_NAME.MAIN),
        'type': 'line',
        'source': dataName(DATA_NAME.MAIN),
        'layout': {},
        'paint': {
            'line-color': 'black',
            'line-width': 0.25,
            'line-opacity': 1,
            'line-opacity-transition': { duration: 250 }
        }
    });

    // contaimated sites
    map.addLayer({
        'id': layerName(DATA_NAME.SITES),
        'type': 'circle',
        'source': dataName(DATA_NAME.SITES),
        'paint': {
            'circle-color': 'orange',
            'circle-opacity': 0,
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'black',
            'circle-stroke-opacity': 0,
            'circle-opacity-transition': { duration: 250 },
            'circle-stroke-opacity-transition': { duration: 250 }
        }
    });

    map.addLayer({ // fill to display on water treatment plant hover
        'id': waterDisplayLayerName(DATA_NAME.WATER),
        'type': 'fill',
        'source': dataName(DATA_NAME.MAIN),
        'paint': {
            'fill-color': 'transparent',
            'fill-opacity': 1,
            'fill-opacity-transition': { duration: 250 }
        }
    });
    map.addLayer({
        'id': borderName(waterDisplayLayerName(DATA_NAME.WATER)),
        'type': 'line',
        'source': dataName(DATA_NAME.MAIN),
        'layout': {},
        'paint': {
            'line-color': 'transparent',
            'line-width': 0.25,
            'line-opacity': 1,
            'line-opacity-transition': { duration: 250 }
        }
    });
    // treatment water plants to be ontop of others
    map.addLayer({
        'id': layerName(DATA_NAME.WATER),
        'type': 'circle',
        'source': dataName(DATA_NAME.WATER),
        'paint': {
            'circle-color': '#01579b',
            'circle-opacity': 0,
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white',
            'circle-stroke-opacity': 0,
            'circle-opacity-transition': { duration: 250 },
            'circle-stroke-opacity-transition': { duration: 250 }
        }
    });

    // air monitoring station
    map.addLayer({
        'id': layerName(DATA_NAME.AIR),
        'type': 'circle',
        'source': dataName(DATA_NAME.AIR),
        'paint': {
            'circle-color': '#03a9f4',
            'circle-opacity': 0,
            'circle-radius': 5,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white',
            'circle-stroke-opacity': 0,
            'circle-opacity-transition': { duration: 250 },
            'circle-stroke-opacity-transition': { duration: 250 }
        }
    });
}

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

function loadingRemove()
{
    $('.loader').css('animation', 'l15 1s infinite linear, loader-key-anim-out 1s forwards ease-in');
    $('#screen-2')
        .removeClass('no-pointer')
        .addClass('screen-anim-in');
}

map.on("load", () => {
    map.addControl(new mapboxgl.NavigationControl()); // add nav controls

    var count = 0;
    var dontQuit = false;
    const timer = setInterval(function() {
        if (fetched == 4 && dontQuit == false)
        {
            dontQuit = true;

            addData();
            addLayers();

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


    initMap();
    initMenu();
});


document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});


