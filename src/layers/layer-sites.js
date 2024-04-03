const SITES = {
    isOn: false,
    isPopupEnabled: true,
    IDWfield: 'idw-field',
    state: 0,
    wantedRows: 20 // number of wanted hexagons per a column
};

function hexName(str)
{
    return `${str}-hex`
}
function hexNameDots(str)
{
    return `${str}-hex-dots`;
}

function genSitesPoints()
{
    SITES.isOn = true;

    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-stroke-opacity', 1);
}
function clearSitesPoints()
{
    SITES.isOn = false;

    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-stroke-opacity', 0);
}

function genFunc(x, maxVal)
{
    return 1 + (Math.ceil(maxVal/7) * x); // linear slope is int
}
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
function getOnScreenPoints()
{
    const data = getScreenAsFeature();
    const features = turf.featureCollection(data.features);
    const bbox = turf.envelope(features);
    const poly = turf.polygon(bbox.geometry.coordinates);
    const pointsArr = DATA[dataName(DATA_NAME.SITES)].features.map((e) =>  e.geometry.coordinates);
    const points = turf.points(pointsArr);
    const res = turf.pointsWithinPolygon(points, poly);

    return res;
}
function rowsFromFlatTopGrid(hexGrid)
{
    /*  we cannot generate a grid with n rows reliably.
        must find the number of rows after generating

        the [turf.hexGrid] function returns a 1d array of the
        format row1, row2, ..., where rows are north to south 
    */
    const firstCentroid = turf.centroid(hexGrid.features[0]);
    var dist = 0;
    var i = 1;
    while (true)
    {
        if (i == hexGrid.features.length) throw new Error('oh no, shouldnt happen');

        const newCentroid = turf.centroid(hexGrid.features[i]);
        const newDist = turf.distance(newCentroid, firstCentroid); 
        if (newDist < dist) break;
        else dist = newDist;
    
        i += 1;
    }

    return i;
}
function colsFromFlatTopGrid(hexGrid, rows)
{
    var seen = 0;
    var cols = 0;
    while (true)
    {
        if (seen > hexGrid.features.length) throw new Error('oh no, shouldnt happen');

        if (seen == hexGrid.features.length) break;
        seen += rows - (cols%2);
        cols += 1;
    }
    return cols;

    var seen = 0;
    var cols = 0;
    while (seen < hexGrid.features.length)
    {
        seen += rows + ((cols+1)%2);
        cols += 1;
    }
    return cols;
}
function factorFunc(val, fac, mx)
{
    return Math.floor(val <= mx * 0.2 ? val * Math.min(fac, 0.15) : val * fac);
}
function doIDW(rows, cols, hexGrid)
{
    const orig = new Array(rows+1).fill(0).map(() => new Array(cols).fill(0));
    var i=0;
    var estimatedMax = 0;
    for (var c=0; c!=cols; ++c)
    {
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
        {
            orig[r][c]=hexGrid.features[i].properties.values.length;
            estimatedMax = Math.max(estimatedMax, orig[r][c]);
        }
    }

    const factor = 0.7;
    const dp = structuredClone(orig);
    for (var c=1; c!=cols; ++c) // top-left to bottom-right
        for (var r=1; r!=rows+((c+1)%2); ++r,++i)
            dp[r][c]=factorFunc(Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r-1][c],dp[r][c-1],dp[r-1][c-1]))), factor, estimatedMax);
    for (var c=cols-2; c!=-1; --c) // top-right to bottom-left
        for (var r=1; r!=rows+((c+1)%2); ++r,++i)
            dp[r][c]=factorFunc(Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r-1][c],dp[r][c+1],dp[r-1][c+1]))), factor, estimatedMax);
    for (var c=cols-2; c!=-1; --c) // bottom-right to top-left
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
            dp[r][c]=factorFunc(Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r+1][c],dp[r][c+1],dp[r+1][c+1]))), factor, estimatedMax);
    for (var c=1; c!=cols; ++c) // bottom-left to top-right
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
            dp[r][c]=factorFunc(Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r+1][c],dp[r][c-1],dp[r+1][c-1]))), factor, estimatedMax);

        var maxVal = 0;
    i=0;
    for (var c=0; c!=cols; ++c)
    {
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
        {
            maxVal = Math.max(maxVal, dp[r][c]);
            hexGrid.features[i].properties[SITES.IDWfield] = dp[r][c];
        }
    }

    return maxVal;
}
function genSitesHexGrid()
{
    // math for hexagons https://www.redblobgames.com/grids/hexagons/

    if (SITES.isOn && SITES.state%4==0)
    {
        SITES.state += 1;

        const onScreenPoints = getOnScreenPoints();

        const bbox = getBoundingBoxfromData(getScreenAsFeature(), 2);
        const poly = turf.bboxPolygon(bbox);
        const se = turf.point(poly.geometry.coordinates[0][1]);
        const ne = turf.point(poly.geometry.coordinates[0][2]);
        const nw = turf.point(poly.geometry.coordinates[0][3]);
        const width = turf.distance(nw, ne, {'units': 'kilometers'});
        const height = turf.distance(ne, se, {'units': 'kilometers'});
        
        const hexSize = height / (SITES.wantedRows * 2); // hexagons for hieght, since flat-top grid
        const hexGridSites = generateHexGrid(bbox, onScreenPoints, hexSize, "ID");
        
        const rows = rowsFromFlatTopGrid(hexGridSites);
        const cols = colsFromFlatTopGrid(hexGridSites, rows);
        const maxWithin = doIDW(rows, cols, hexGridSites);

        map.addSource(hexName(DATA_NAME.SITES), {
            'type': 'geojson',
            'data': hexGridSites
        });
    
        map.addLayer({
            id: layerName(hexName(DATA_NAME.SITES)),
            type: 'fill',
            source: hexName(DATA_NAME.SITES),
            layout: {},
            paint: {
                'fill-color': [
                    'case',
                    ['<=', ['get', SITES.IDWfield], 0], 'transparent',
                    ['<=', ['get', SITES.IDWfield], genFunc(0, maxWithin)], '#00043A',
                    ['<=', ['get', SITES.IDWfield], genFunc(1, maxWithin)], '#002962',
                    ['<=', ['get', SITES.IDWfield], genFunc(2, maxWithin)], '#004E89',
                    ['<=', ['get', SITES.IDWfield], genFunc(3, maxWithin)], '#407BA7',
                    ['<=', ['get', SITES.IDWfield], genFunc(4, maxWithin)], '#FF002B',
                    ['<=', ['get', SITES.IDWfield], genFunc(5, maxWithin)], '#C00021',
                    ['<=', ['get', SITES.IDWfield], genFunc(6, maxWithin)], '#A0001C',
                    ['<=', ['get', SITES.IDWfield], genFunc(7, maxWithin)], '#800016',
                    'black'
                ],
                'fill-opacity': 0.0,
                'fill-opacity-transition': { duration: 250 }
            }
        });

        for (var i=0; i!= 8; ++i)
            $(`#legend-sites-desc-${i}`).text(`≤ ${genFunc(i, maxWithin)}`);

        map.addSource(hexNameDots(DATA_NAME.SITES), {
            'type': 'geojson',
            'data': onScreenPoints
        });

        map.addLayer({
            'id': layerName(hexNameDots(DATA_NAME.SITES)),
            'type': 'circle',
            'source': hexNameDots(DATA_NAME.SITES),
            'paint': {
                'circle-color': 'orange',
                'circle-opacity': 0,
                'circle-radius': 5,
                'circle-stroke-width': 2,
                'circle-stroke-color': 'white',
                'circle-stroke-opacity': 0,
                'circle-opacity-transition': { duration: 250 },
                'circle-stroke-opacity-transition': { duration: 250 }
            }
        });

        // wait until actually added until animating in. smoother
        setTimeout(e => {
            map.setPaintProperty(layerName(hexName(DATA_NAME.SITES)), 'fill-opacity', 0.6);
            map.setPaintProperty(layerName(hexNameDots(DATA_NAME.SITES)), 'circle-opacity', 1);
            map.setPaintProperty(layerName(hexNameDots(DATA_NAME.SITES)), 'circle-stroke-opacity', 1);
            
            SITES.state += 1;
        }, 100);
    }
}
function clearSitesHexGrid()
{
    if (SITES.isOn &&  SITES.state%4==2)
    {
        SITES.state += 1;

        map.setPaintProperty(layerName(hexName(DATA_NAME.SITES)), 'fill-opacity', 0);
        map.setPaintProperty(layerName(hexNameDots(DATA_NAME.SITES)), 'circle-opacity', 0);
        map.setPaintProperty(layerName(hexNameDots(DATA_NAME.SITES)), 'circle-stroke-opacity', 0);
        
        setTimeout(e => {    
            map.removeLayer(layerName(hexName(DATA_NAME.SITES)));
            map.removeSource(hexName(DATA_NAME.SITES));
            map.removeLayer(layerName(hexNameDots(DATA_NAME.SITES)));
            map.removeSource(hexNameDots(DATA_NAME.SITES));
            
            SITES.state += 1;
        }, 250);
    }
}

