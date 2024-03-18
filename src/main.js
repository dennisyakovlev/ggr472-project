mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";

const map = new mapboxgl.Map({
	container: 'my-map', // container ID
	style: 'mapbox://styles/dennisyakovlev40/clskppghq03u401p2c3184488', // my edited monochrone
	center: [-85.9, 50.7], // starting position [lng, lat], aim at NYC
	zoom: 4, // starting tile zoom
    pitch: 45
});

function addDataAndLayers()
{
    map.addSource('sites-data', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/contaminated_sites_ON.geojson'
    });

    map.addSource('air-data', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/dennisyakovlev/ggr472-project/master/data/airpollution_subset.geojson'
    });


    var airData = map.addLayer({
        'id': 'air-data-layer',
        'type': 'fill-extrusion',
        'source': 'air-data',
        'paint': {
            
        }
    });
    map.addLayer({
        'id': 'air-data-layer-border',
        'type': 'line',
        'source': 'air-data',
        'paint': {
            'line-color': 'black'
        }
    });

    var sitesData = map.addLayer({
        'id': 'sites-data-layer',
        'type': 'circle',
        'source': 'sites-data',
        'paint': {
            'circle-color': 'red'
        }
    });
}

map.on("load", () => {
    map.addControl(new mapboxgl.NavigationControl()); // add nav controls

    addDataAndLayers();


    // const btn1 = new Button('btn-1');
    // var stateTransitions = 1;
    // btn1.addOnFunc(function(e) {
    //     transitionFunc(e, stateTransitions);
    //     stateTransitions += 1;
    // });
    // btn1.addOffFunc(function(e) {
    //     transitionFunc(e, stateTransitions);
    //     stateTransitions += 1;
    // });

    // const menu = new Menu('menu-1');
    // menu.enableAnim();

    // var stateTransitions = 1;
    // menu.addOnFunc(function(e, state) {
    //     console.log('IN')
    //     // transitionFunc(e, stateTransitions);
    //     // stateTransitions += 1;
    // });
    // menu.addOffFunc(function(e, state) {
    //     console.log('OUT')
    // }); 

});

$(document).ready(function() {
    const menu = new Menu('menu-1');
    menu.enableAnim();
})
