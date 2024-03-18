mapboxgl.accessToken = "pk.eyJ1IjoiZGVubmlzeWFrb3ZsZXY0MCIsImEiOiJjbHMyNnViazIwMHB5MmpvNHlvc3B2bDQ2In0.nTDRJJnhgM_EW8tSwyOchg";

const map = new mapboxgl.Map({
	container: 'my-map', // container ID
	style: 'mapbox://styles/dennisyakovlev40/clskppghq03u401p2c3184488', // my edited monochrone
	center: [-73.9, 40.7], // starting position [lng, lat], aim at NYC
	zoom: 9, // starting tile zoom
});

map.on("load", () => {

    const btn1 = new Button('btn-1');
    var stateTransitions = 1;
    btn1.addOnFunc(function(e) {
        transitionFunc(e, stateTransitions);
        stateTransitions += 1;
    });
    btn1.addOffFunc(function(e) {
        transitionFunc(e, stateTransitions);
        stateTransitions += 1;
    });

});
