/*  add toggalable popup functionality for some layer
*/
function initPopupForLayer(dataName, htmlFunc)
{
    verifyDataName(dataName);

    const startText = new SwappableText(`text-a-secondary-${dataName}-popup`, [0,1]);
    const afterText = new SwappableText(`text-b-secondary-${dataName}-popup`, [0,1]);

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

/*  add legend for some chrloropleth layer
*/
function initLegendForLayer(dataName, mapPoly)
{
    verifyDataName(dataName);

    const legend  = new HorizontalMenu(`legend-${dataName}`, [0,1]);
    const trigger = createTrigger(`trigger-secondary-${dataName}`, 2);
    trigger.addAnimElem({type: 'click', anim: legend});

    for (let i=0; i!=mapPoly.numIntervals(); ++i)
    {
        const legendItem = new LegenedItem(`legend-${dataName}-background-${i}`, [0,1], mapPoly);

        const legendTrigger    = new NthTransitionable(`legend-${dataName}-${i}`, 2);
        legendTrigger.addAnimElem({type: 'click', anim: legendItem});
    }
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
    const layer = new MapChloropleth({
        targetId           : layerName(DATA_NAME.immigrant),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.immigrant),
        source             : dataName(DATA_NAME.immigrant),
        fillVariable       : 'total_immi_pct',
        fillColors         : ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15'],
        intervals          : INTERVALS[DATA_NAME.immigrant],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-immigrant', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const immigrantHtml = (feature) => {
        const prop = feature.properties;

        return  `hehe`;
    };
    initPopupForLayer('immigrant', immigrantHtml);
    initLegendForLayer('immigrant', layer);
}

function initIncome()
{
    const layer = new MapChloropleth({
        targetId           : layerName(DATA_NAME.income),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.income),
        source             : dataName(DATA_NAME.income),
        fillVariable       : 'low_income_pct',
        fillColors         : ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15'],
        intervals          : INTERVALS[DATA_NAME.income],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-income', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const incomeHtml = (feature) => {
        const prop = feature.properties;

        return  `hawhaw`;
    };
    initPopupForLayer('income', incomeHtml);
    initLegendForLayer('income', layer);

}

function initMinority()
{
    const layer = new MapChloropleth({
        targetId           : layerName(DATA_NAME.minority),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.minority),
        source             : dataName(DATA_NAME.minority),
        fillVariable       : 'visible_minority_pct',
        fillColors         : ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15'],
        intervals          : INTERVALS[DATA_NAME.minority],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-minority', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const minorityHtml = (feature) => {
        const prop = feature.properties;

        return  `herherher`;
    };
    initPopupForLayer('minority', minorityHtml);
    initLegendForLayer('minority', layer);
}

function initAssessChoose(isFirst)
{
    const letter = isFirst ? 'a' : 'b';
    const text1 = new SwappableText(`text-0-secondary-assess-choose-${letter}`, [0,3]);
    const text2 = new SwappableText(`text-1-secondary-assess-choose-${letter}`, [0,1]);
    const text3 = new SwappableText(`text-2-secondary-assess-choose-${letter}`, [1,2]);
    const text4 = new SwappableText(`text-3-secondary-assess-choose-${letter}`, [2,3]);

    const trigger = createTrigger(`trigger-secondary-assess-choose-${letter}`, 4);
    trigger.addAnimElem({type: 'click', anim: text2});
    trigger.addAnimElem({type: 'click', anim: text3});
    trigger.addAnimElem({type: 'click', anim: text4});
    // offset initial text
    const afterId = trigger.addAnimElem({type: 'click', anim: text1});
    trigger.forceCycle('click', afterId, 1);
    text1.rotateRightClasses(1);
}
function initAssessQuartile(isFirst)
{
    const letter = isFirst ? 'a' : 'b';

    for (let i=0; i!=4; ++i)
    {
        const quartile = new StaticHiglightable(`secondary-assess-quartile-${letter}-background-${i}`, [0,1]);
        const trigger  = new NthTransitionable(`trigger-secondary-assess-quartile-${letter}-${i}`, 2);
        
        const afterId = trigger.addAnimElem({type: 'click', anim: quartile});
        trigger.forceCycle('click', afterId, 1);
        quartile.rotateRightClasses(1);
    }
}
function initAssessOp()
{
    const text1 = new SwappableText('text-0-secondary-assess-op', [0,1]);
    const text2 = new SwappableText('text-1-secondary-assess-op', [0,1]);
    
    const trigger = createTrigger('trigger-secondary-assess-op', 2);
    trigger.addAnimElem({type: 'click', anim: text2});
    // offset initial text
    const afterId = trigger.addAnimElem({type: 'click', anim: text1});
    trigger.forceCycle('click', afterId, 1);
    text1.rotateRightClasses(1);
}
function initAssessRun()
{
    const layer    = new MapChloropleth({
        targetId           : layerName(DATA_NAME.assess),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.assess),
        source             : dataName(DATA_NAME.assess),
        fillVariable       : 'binary_val',
        fillColors         : ['transparent', 'green'],
        intervals          : [0, 1],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const text1    = new SwappableText('text-a-secondary-assess-run', [0,1]);
    const text2    = new SwappableText('text-b-secondary-assess-run', [0,1]);
    const assesser = new Assesser('', [0], layer);
    
    const trigger = createTrigger('trigger-secondary-assess-run', 2);
    trigger.addAnimElem({type: 'click', anim: text2});
    trigger.addAnimElem({type: 'click', anim: assesser});
    trigger.addAnimElem({type: 'click', anim: layer, delay: 1500});

    // offset initial text
    const afterId = trigger.addAnimElem({type: 'click', anim: text1});
    trigger.forceCycle('click', afterId, 1);
    text1.rotateRightClasses(1);
}

function initMap()
{
    // enviornmental indicator layers
    initAirStations();
    initWaterTreatment();
    initContaimatedSites();

    // to multiplex create a filter which forcefully transition the previous on
    //      if it exists
    // everything you want to be part of the multiplexer will use the filter, filter
    //      should always return true

    // demographic statistic layers
    initImmigrant();
    initIncome();
    initMinority();

    // assessment menu
    initAssessChoose(true);
    initAssessChoose(false);
    initAssessQuartile(true);
    initAssessQuartile(false);
    initAssessOp();
    initAssessRun();
}