let fetched = 0; // number of files currently done fetching

/*  asynchronoudly fetch files
*/
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/water_hover.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.water_hover)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });

// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/sites.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.sites)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });

// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/water.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.water)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });


// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/air.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.air)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });


// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/immigrant.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.immigrant)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/income.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.income)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/minority.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.minority)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/assess.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.assess)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/risk_normal.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.risk_normal)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });
// fetch('https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/risk_scaled.geojson')
//     .then(response => response.json())
//     .then(response => {
//         DATA[dataName(DATA_NAME.risk_scaled)] = response;
//         fetched += 1;
//     })
//     .catch(err => {
//         throw new Error('Problem loading');
//     });

/*  add fetched data to map
*/
function addData()
{
    // main data
    map.addSource(dataName(DATA_NAME.water_hover), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.water_hover)]
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


    map.addSource(dataName(DATA_NAME.risk_normal), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.risk_normal)]
    });
    map.addSource(dataName(DATA_NAME.risk_scaled), {
        'type': 'geojson',
        'data': DATA[dataName(DATA_NAME.risk_scaled)]
    });
}

function asyncFetchFile(fileName)
{
    return new Promise((resolve, reject) => {
        fetch(`https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/${fileName}.geojson`)
            .then(response => response.json())
            .then(response => {
                DATA[dataName(DATA_NAME[fileName])] = response;

                resolve(fileName);
            })
            .catch(err => {
                throw new Error('Problem loading');
            });
    });
}

let   MAP_READY    = false;
const allFileNames = [
    'immigrant',
    'income',
    'minority',
    'sites',
    'water',
    'water_hover',
    'air',
    'risk_normal',
    'risk_scaled',
    'assess'
];

Promise
    .all(allFileNames.map(asyncFetchFile))
    .then((fileNames) => {
        let i = 0;
        const interval = setInterval(e => {
            if (MAP_READY === true)
            {
                if (i == fileNames.length)
                {
                    console.log('done')
                    initNavBar();
                    initMap();

                    $('.loader').css('animation', 'l15 1s infinite linear, loader-key-anim-out 1s forwards ease-in');
                    setTimeout(e => $('#screen-1').remove(), 1000);

                    clearInterval(interval);
                    return;
                }

                console.log(`adding ${i} ${fileNames[fileNames.length - 1 - i]}`)
                map.addSource(dataName(DATA_NAME[fileNames[fileNames.length - 1 - i]]), {
                    'type': 'geojson',
                    'data': DATA[dataName(DATA_NAME[fileNames[fileNames.length - 1 - i]])]
                });

                console.log('added')
                i += 1;
            }
        }, 1500);
    });

map.on('load', () => {
    MAP_READY = true;
});

// map.on("load", () => {
//     map.addControl(new mapboxgl.NavigationControl()); // add nav controls

//     let count = 0;
//     let dontQuit = false;
//     const timer = setInterval(function() {
//         // done fetching all five data files and not terminated ?
//         if (fetched == 10 && dontQuit == false)
//         {
//             dontQuit = true;

//             addData();
//             initMap();

//             // after everything has been added give mapbox
//             // a seoncd to render the map, then show it
//             setTimeout(e => loadingRemove(), 1000);

//             clearInterval(timer);
//         }
//         // failed to fetch data
//         if (count == 40 && dontQuit == false)
//         {
//             loadFail();
//             clearInterval(timer);
//         }
//         count += 1;
//     }, 500);

//     // can do this without the map
//     initNavBar();
// });

// debug
document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});
