var disable = false;
const rows = 20; // numbers of hexagons in a column for outerBbox
var  sitesBtn;
var hexBtn;

function hexName(str)
{
    return `${str}-hex`
}

function colsFromQColGrid(hexGrid)
{

    // TODO: hexaons per row is not so easy since flat-top grid,
    // do this for now change to actual math formula later
    var seen = 0;
    var cols = 0;
    while (seen < hexGrid.features.length)
    {
        seen += rows + ((cols+1)%2);
        cols += 1;
    }
    return cols;
}

function genSitesHexGrid()
{
    // math for hexagons https://www.redblobgames.com/grids/hexagons/

    if (disable == false)
    {
        disable = true;

        const screenBbox = getScreenAsFeature();
        // const innerBbox = getBoundingBoxfromData(screenBbox, 1);
        // const outerBbox = getBoundingBoxfromData(screenBbox, 2);
        const bbox = getBoundingBoxfromData(screenBbox, 1);
        
        const poly = turf.bboxPolygon(bbox);
        const se = turf.point(poly.geometry.coordinates[0][1]);
        const ne = turf.point(poly.geometry.coordinates[0][2]);
        const nw = turf.point(poly.geometry.coordinates[0][3]);
        const width = turf.distance(nw, ne, {'units': 'kilometers'});
        const height = turf.distance(ne, se, {'units': 'kilometers'});
        
        const hexSize = height / (rows * 2); // hexagons for hieght, since flat-top grid
        const hexGridSites = generateHexGrid(bbox, DATA[dataName(DATA_NAME.SITES)], hexSize, "ID");
        
        // const wantedSites = turf.pointsWithinPolygon(, innerBbox);

        // get all point within bounding box of scale 1
        // orig/dp is for bounding box os scale 2, hexagons use this
        // set orig using scale, run IDW

        const cols = colsFromQColGrid(hexGridSites);

        // HERE: currently having issues with clear rectangle around the hexagons
        // to fix, make bbox scale by factor of 2, then when init orig adjust start of
        // rows and cols accordingly
        // would need to take double the wanted number of polygons

        // also change color of points within the current analysis area

        // use dynamic programming algo to find hexagons within
        // some distance of an actual point
        // this is IDW interpolation using inverse exponential as function
        const orig = new Array(rows+1).fill(0).map(() => new Array(cols).fill(0));
        var maxIndex = 0;
        i=0;
        for (var c=0; c!=cols; ++c)
            for (var r=rows+((c+1)%2)-1; r!=-1; --r,++i)
                orig[r][c]=hexGridSites.features[i].properties.values.length,
                maxIndex = Math.max(maxIndex, orig[r][c]);

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
    
        // var maxIndex = 0;
        i=0;
        for (var c=0; c!=cols; ++c)
        {
            for (var r=rows+((c+1)%2)-1; r!=-1; --r,++i)
            {
                hexGridSites.features[i].properties['indexValue'] = dp[r][c];
            }
        }

        console.log(rows, cols);
        console.log(dp)
        console.log(maxIndex)
        // console.log(hexGridSites)


        // should clip data, generate legend, run algo on hex grid to remove hexas

        // 

        console.log(hexGridSites)

        // contaminated sites
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
                    ['<=', ['get', 'indexValue'], 0], 'transparent',
                    ['<=', ['get', 'indexValue'], 2], '#6A00F4',
                    ['<=', ['get', 'indexValue'], 4], '#8900F2',
                    ['<=', ['get', 'indexValue'], 6], '#A100F2',
                    ['<=', ['get', 'indexValue'], 8], '#B100E8',
                    ['<=', ['get', 'indexValue'], 10], '#BC00DD',
                    ['<=', ['get', 'indexValue'], 12], '#D100D1',
                    ['<=', ['get', 'indexValue'], 16], '#DB00B6',
                    ['<=', ['get', 'indexValue'], 20], '#E500A4',
                    ['<=', ['get', 'indexValue'], 100], '#F20089',
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

function genSitesPoints()
{
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-opacity', 1);
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-stroke-opacity', 1);
}

function clearSitesPoints(forceBtn)
{
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-opacity', 0);
    map.setPaintProperty(layerName(DATA_NAME.SITES), 'circle-stroke-opacity', 0);
}

function forceSafeClearSitesHex()
{
    if (hexBtn.getState() % 2 == 1)
    {
        hexBtn.forceTransition();
    }
}

function forceSafeClearSitesPoints()
{
    if (sitesBtn.getState() % 2 == 1)
    {
        sitesBtn.forceTransition();
    }
}

map.on('load', () => {
    const menu = new Menu('menu-btn-sites');
    menu.enableAnim();

    sitesBtn = new Button('btn-4');
    sitesBtn.enableAnim();
    sitesBtn.addOnFunc((e,state) => genSitesPoints());
    sitesBtn.addOffFunc((e,state) => clearSitesPoints());

    hexBtn = new Button('btn-5');
    hexBtn.enableAnim();
    hexBtn.addOnFunc((e,state) => genSitesHexGrid());
    hexBtn.addOffFunc((e,state) => clearSitesHexGrid());
});
