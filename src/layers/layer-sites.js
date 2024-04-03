var disable = false;
var  sitesBtn;
var hexBtn;

const SITES = {
    isOn: false,
    isPopupEnabled: true,
    IDWfield: 'idw-field',
    wantedRows: 20 // number of wanted hexagons per a column
};

function hexName(str)
{
    return `${str}-hex`
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
function doIDW(rows, cols, hexGrid)
{
    const orig = new Array(rows+1).fill(0).map(() => new Array(cols).fill(0));
    var maxVal = 0;
    i=0;
    for (var c=0; c!=cols; ++c)
    {
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
        {
            orig[r][c]=hexGrid.features[i].properties.values.length;
            maxVal = Math.max(maxVal, orig[r][c]);
        }
    }

    const dp = structuredClone(orig);
    for (var c=1; c!=cols; ++c) // top-left to bottom-right
        for (var r=1; r!=rows+((c+1)%2); ++r,++i)
            dp[r][c]=Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r-1][c],dp[r][c-1],dp[r-1][c-1]) / 2));
    for (var c=cols-2; c!=-1; --c) // top-right to bottom-left
        for (var r=1; r!=rows+((c+1)%2); ++r,++i)
            dp[r][c]=Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r-1][c],dp[r][c+1],dp[r-1][c+1]) / 2));
    for (var c=cols-2; c!=-1; --c) // bottom-right to top-left
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
            dp[r][c]=Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r+1][c],dp[r][c+1],dp[r+1][c+1]) / 2));
    for (var c=1; c!=cols; ++c) // bottom-left to top-right
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
            dp[r][c]=Math.max(dp[r][c], orig[r][c] + Math.floor(Math.max(dp[r+1][c],dp[r][c-1],dp[r+1][c-1]) / 2));

    i=0;
    for (var c=0; c!=cols; ++c)
    {
        for (var r=rows+((c+1)%2)-2; r!=-1; --r,++i)
        {
            hexGrid.features[i].properties[SITES.IDWfield] = dp[r][c];
        }
    }

    return maxVal;
}
function genSitesHexGrid()
{
    // math for hexagons https://www.redblobgames.com/grids/hexagons/

    if (disable == false)
    {
        disable = true;

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
        console.log(rows, cols);

        doIDW(rows, cols, hexGridSites);

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
                    ['<=', ['get', SITES.IDWfield], 2], '#6A00F4',
                    ['<=', ['get', SITES.IDWfield], 4], '#8900F2',
                    ['<=', ['get', SITES.IDWfield], 6], '#A100F2',
                    ['<=', ['get', SITES.IDWfield], 8], '#B100E8',
                    ['<=', ['get', SITES.IDWfield], 10], '#BC00DD',
                    ['<=', ['get', SITES.IDWfield], 12], '#D100D1',
                    ['<=', ['get', SITES.IDWfield], 16], '#DB00B6',
                    ['<=', ['get', SITES.IDWfield], 20], '#E500A4',
                    ['<=', ['get', SITES.IDWfield], 100], '#F20089',
                    'red'
                ],
                'fill-opacity': 0.0,
                'fill-opacity-transition': { duration: 250 }
            }
        });

        setTimeout(e => {
            map.setPaintProperty(layerName(hexName(DATA_NAME.SITES)), 'fill-opacity', 0.6);
            disable = false;
        }, 100);
    }
    else
    {
        // display error
    }
}
function clearSitesHexGrid(forceBtn)
{
    if (disable == false)
    {
        disable = true;

        map.setPaintProperty(layerName(hexName(DATA_NAME.SITES)), 'fill-opacity', 0);

        setTimeout(e => {    
            map.removeLayer(layerName(hexName(DATA_NAME.SITES)));
            map.removeSource(hexName(DATA_NAME.SITES));
            
            disable = false;
        }, 250);
    
        disable = false;
    }
    else
    {
        // display error
    }
}

function forceSafeClearSitesHex()
{
    if (hexBtn.getState() % 2 == 1)
    {
        hexBtn.forceTransition();
    }
}

