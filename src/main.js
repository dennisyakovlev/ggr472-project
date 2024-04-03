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
        DATA[dataName(DATA_NAME.PLANTS)] = response;
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

    // treatment plants
    map.addSource(dataName(DATA_NAME.PLANTS), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.PLANTS)]
    });
}

function addLayers()
{
    // main data
    var dataFill = map.addLayer({
        'id': layerName(DATA_NAME.MAIN),
        'type': 'fill',
        'source': dataName(DATA_NAME.MAIN),
        'layout': {},
        'paint': {
            'fill-color': [
                'case',
                ['<=', ['get', 'Combined_Risk_Score'], 8], '#FEE5D9',
                ['<=', ['get', 'Combined_Risk_Score'], 11], '#FCAE91',
                ['<=', ['get', 'Combined_Risk_Score'], 13], '#FB6A4A',
                ['<=', ['get', 'Combined_Risk_Score'], 15], '#DE2D26',
                ['<=', ['get', 'Combined_Risk_Score'], 20], '#A50F15',
                'blue'
            ],
            'fill-opacity': 1,
            'fill-opacity-transition': { duration: 250 }
        }
    });
    var dataBorders = map.addLayer({
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

    // treatment plants
    var plantsCircle = map.addLayer({
        'id': layerName(DATA_NAME.PLANTS),
        'type': 'circle',
        'source': dataName(DATA_NAME.PLANTS),
        'paint': {
            'circle-color': 'grey'
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
    $('#screen-2').addClass('screen-anim-in');
}

map.on("load", () => {
    map.addControl(new mapboxgl.NavigationControl()); // add nav controls

    var count = 0;
    var dontQuit = false;
    const timer = setInterval(function() {
        if (fetched == 3 && dontQuit == false)
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

});

