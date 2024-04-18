/*  add toggalable popup functionality for some layer
*/
function initPopupForLayer(dataName, htmlFunc)
{
    if (!DATA_NAME.hasOwnProperty(dataName))
        throw new Error(`type of data [${dataName}] is not valid`);

    const startText     = new SwappableText(`text-a-secondary-${dataName}-popup`, [0,1]);
    const afterText     = new SwappableText(`text-b-secondary-${dataName}-popup`, [0,1]);

    const secondaryTrigger = createTrigger(`btn-secondary-${dataName}-popup`, 2);
    secondaryTrigger.addAnimElem({type: 'click', anim: afterText});
    // offset initial text
    const afterId = secondaryTrigger.addAnimElem({type: 'click', anim: startText});
    secondaryTrigger.forceCycle('click', afterId, 1);
    startText.rotateRightClasses(1);

    const popup = new MapPopup(
        createTrigger(`trigger-secondary-${dataName}`, 2),
        secondaryTrigger,
        layerName(DATA_NAME[dataName]),
        htmlFunc);
}

function initAirStations()
{
    const layer = new MapPoints({
        targetId           : layerName(DATA_NAME.air),
        congrouenceClasses : [0,1],
        source             : dataName(DATA_NAME.air),
        fill               : '#03a9f4',
        radius             : 5,
        border_color       : 'white',
        border_width       : 1,
        duration           : 250
    });    
    const trigger = createTrigger('trigger-secondary-air', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const airHtml = (feature) => {
        const prop = feature.properties;

        return  `
                <h2>Air Quality Measuring Station</h2>
                <p>City: ${prop['City']}</p>
                <p>Average PM2.5 Concentration: ${prop['Average PM2.5 Concentration in 2022']}</p>
                <p>Location: ${prop['Location of Air Monitoring Station']}</p>
                `;
    };
    initPopupForLayer('air', airHtml);
}

function initWaterTreatment()
{
    const layer = new MapPoints({
        targetId           : layerName(DATA_NAME.water),
        congrouenceClasses : [0,1],
        source             : dataName(DATA_NAME.water),
        fill               : '#01579b',
        radius             : 5,
        border_color       : 'white',
        border_width       : 1,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-water', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const waterHtml = (feature) => {
        const prop = feature.properties;

        return  `
            <h2>Water Quality Measuring Station</h2>
            <p>Name: ${prop['Name of water treatment facility']}</p>
            <p>Average Nitrogen Levels: ${prop['Average nitrogen levels']}</p>
            <p>Average Phosphorus Levels: ${prop['Average phosphorus levels']}</p>
            `;
    };
    initPopupForLayer('water', waterHtml);
}

function initContaimatedSites()
{
    const layer = new MapPoints({
        targetId           : layerName(DATA_NAME.sites),
        congrouenceClasses : [0,1],
        source             : dataName(DATA_NAME.sites),
        fill               : '#AF9B46',
        radius             : 3,
        border_color       : 'black',
        border_width       : 1,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-sites', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const sitesHtml = (feature) => {
        const prop = feature.properties;

        return  `
            <h2>Federal Contaminated Site</h2>
            <p>Name: ${prop['Site name']}</p>
            <p>Priority level: ${prop['Priority level']}</p>
            <p>Census Subdivision: ${prop['Census subdivision name']}</p>
            `;
    };
    initPopupForLayer('sites', sitesHtml);
}

function initImmigrant()
{
    
}

function initMap()
{
    // enviornmental indicator layers
    initAirStations();
    initWaterTreatment();
    initContaimatedSites();

    // to multiplex create a filter which forcefully transition the previous on
    // if it exists

    // demographic statistic layers
}