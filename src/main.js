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

// debug
document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});
