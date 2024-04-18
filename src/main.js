let fetched = 0; // number of files currently done fetching

/*  asynchronoudly fetch files
*/
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
        DATA[dataName(DATA_NAME.sites)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/water_facilities.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.water)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });


fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/pollution.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.air)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/demographics.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.SOCIO)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/immigrants.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.immigrant)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });
fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/low_income.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.income)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });
fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/visible_minority.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.minority)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });
fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/data_assess.geojson')
    .then(response => response.json())
    .then(response => {
        DATA[dataName(DATA_NAME.assess)] = response;
        fetched += 1;
    })
    .catch(err => {
        throw new Error('Problem loading');
    });

/*  add fetched data to map
*/
function addData()
{
    // main data
    map.addSource(dataName(DATA_NAME.MAIN), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.MAIN)]
    });

    // contaminated sites
    map.addSource(dataName(DATA_NAME.sites), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.sites)]
    });

    // treatment WATER
    map.addSource(dataName(DATA_NAME.water), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.water)]
    });

    // air monitoring
    map.addSource(dataName(DATA_NAME.air), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.air)]
    });

    // sociodemographic
    map.addSource(dataName(DATA_NAME.SOCIO), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.SOCIO)]
    });

    map.addSource(dataName(DATA_NAME.immigrant), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.immigrant)]
    });
    map.addSource(dataName(DATA_NAME.income), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.income)]
    });
    map.addSource(dataName(DATA_NAME.minority), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.minority)]
    });


    map.addSource(dataName(DATA_NAME.assess), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.assess)]
    });
}

/*  add the data as layers to the map
*/
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

    // below others
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

    // contaimated sites
    map.addLayer({
        'id': layerName(DATA_NAME.SITES),
        'type': 'circle',
        'source': dataName(DATA_NAME.SITES),
        'paint': {
            'circle-color': '#AF9B46',
            'circle-opacity': 0,
            'circle-radius': 3,
            'circle-stroke-width': 1,
            'circle-stroke-color': 'black',
            'circle-stroke-opacity': 0,
            'circle-opacity-transition': { duration: 250 },
            'circle-stroke-opacity-transition': { duration: 250 }
        }
    });

    // water treatment facilities
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

    // sociodemographic
    map.addLayer({
        'id': layerName(DATA_NAME.SOCIO),
        'type': 'fill',
        'source': dataName(DATA_NAME.SOCIO),
        'layout': {},
        'paint': {
            'fill-color': buildSocioColorValue(),
            'fill-opacity': 0,
            'fill-opacity-transition': { duration: 250 }
        }
    });
    map.addLayer({
        'id': borderName(DATA_NAME.SOCIO),
        'type': 'line',
        'source': dataName(DATA_NAME.SOCIO),
        'layout': {},
        'paint': {
            'line-color': 'black',
            'line-width': 0.25,
            'line-opacity': 0,
            'line-opacity-transition': { duration: 250 }
        }
    });
}

/*  remove the loading screen and show map
*/
function loadingRemove()
{
    $('.loader').css('animation', 'l15 1s infinite linear, loader-key-anim-out 1s forwards ease-in');
    $('#screen-2')
        .removeClass('no-pointer')
        .addClass('screen-anim-in');
    $('.bigger-menu-info')
        .removeClass('no-pointer')
        .addClass('screen-anim-in');
}



map.on("load", () => {
    map.addControl(new mapboxgl.NavigationControl()); // add nav controls



    let count = 0;
    let dontQuit = false;
    const timer = setInterval(function() {
        // done fetching all five data files and not terminated ?
        if (fetched == 9 && dontQuit == false)
        {
            dontQuit = true;

            addData();
            initMap();
            // addLayers();

            // after everything has been added give mapbox
            // a seoncd to render the map, then show it
            setTimeout(e => loadingRemove(), 1000);

            clearInterval(timer);
        }
        // failed to fetch data
        if (count == 40 && dontQuit == false)
        {
            loadFail();
            clearInterval(timer);
        }
        count += 1;
    }, 500);

    // can do this without the map
    initNavBar();
});

// debug
document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});
