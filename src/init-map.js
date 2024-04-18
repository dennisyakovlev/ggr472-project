const roundTo = 2;

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

function initWaterTreatment()
{
    const trigger = createTrigger('trigger-secondary-water', 2);



    // ----------- special button for water area coverage -----------
    const startText = new SwappableText(`text-a-secondary-water-hover`, [0,1]);
    const afterText = new SwappableText(`text-b-secondary-water-hover`, [0,1]);

    const secondaryTrigger = createTrigger(`btn-secondary-water-hover`, 2);
    secondaryTrigger.addAnimElem({type: 'click', anim: afterText});
    // offset initial text
    const afterId = secondaryTrigger.addAnimElem({type: 'click', anim: startText});
    secondaryTrigger.forceCycle('click', afterId, 1);
    startText.rotateRightClasses(1);

    const special = new WaterHover({
        targetId           : layerName(layerName(DATA_NAME.water)),
        secondaryTargetId  : borderName(layerName(DATA_NAME.water)),
        waterId            : layerName(DATA_NAME.water),
        source             : dataName(DATA_NAME.water_hover),
        mainTrigger        : trigger,
        secondTrigger      : secondaryTrigger,
        fillColor          : '#81d4fa',
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    // ----------- end -----------



    const points = new MapPoints({
        targetId           : layerName(DATA_NAME.water),
        congrouenceClasses : [0,1],
        source             : dataName(DATA_NAME.water),
        fill               : '#01579b',
        radius             : 5,
        border_color       : 'white',
        border_width       : 1,
        duration           : 250
    });
    trigger.addAnimElem({type: 'click', anim: points});

    const waterHtml = (feature) => {
        const prop = feature.properties;

        return  `
            <h2>Water Quality Measuring Station</h2>
            <p>Facility Name: ${prop['Name of water treatment facility']}</p>
            <p>Average Nitrogen Levels: ${roundDec(parseFloat(prop['Average nitrogen levels']), roundTo)}</p>
            <p>Average Phosphorus Levels: ${roundDec(parseFloat(prop['Average phosphorus levels']), roundTo * 2)}</p>
            `;
    };
    initPopupForLayer('water', waterHtml);
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
                <p>Location: ${prop['Location of Air Monitoring Station']}</p>
                <p>Average PM2.5 Concentration: ${roundDec(parseFloat(prop['Average PM2.5 Concentration in 2022']), roundTo)}</p>
                `;
    };
    initPopupForLayer('air', airHtml);
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

        return  `
            <h2>Immgrant Statistics</h2>
            <p>Census Subdivision: ${prop['CSDNAME']}</p>
            <p>Immigrants as POP: ${roundDec(parseFloat(prop['total_immi_pct']), roundTo)}</p>
            `;
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

        return  `
            <h2>Low Income Statistics</h2>
            <p>Census Subdivision: ${prop['CSDNAME']}</p>
            <p>Low Income Households as POP: ${roundDec(parseFloat(prop['low_income_pct']), roundTo)}</p>
            `;
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

        return  `
            <h2>Minority Statistics</h2>
            <p>Census Subdivision: ${prop['CSDNAME']}</p>
            <p>Minorities as POP: ${roundDec(parseFloat(prop['visible_minority_pct']), roundTo)}</p>
            `;
    };
    initPopupForLayer('minority', minorityHtml);
    initLegendForLayer('minority', layer);
}

function initRiskNormal()
{
    const layer = new MapChloropleth({
        targetId           : layerName(DATA_NAME.risk_normal),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.risk_normal),
        source             : dataName(DATA_NAME.risk_normal),
        fillVariable       : 'Combined_Risk_Score',
        fillColors         : ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15'],
        intervals          : INTERVALS[DATA_NAME.risk_normal],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-risk_normal', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const riskNormalHtml = (feature) => {
        const prop = feature.properties;

        return  `
            <h2>Scaled Risk Score</h2>
            <p>Census Subdivision: ${prop['CSDNAME']}</p>
            <p>Scaled Risk Score: ${prop['Combined_Risk_Score']}</p>
            <p>Average PM2.5 concentration: ${roundDec(parseFloat(prop['Average PM2.5 concentration']), roundTo)}</p> 
            `;
    };
    initPopupForLayer('risk_normal', riskNormalHtml);
    initLegendForLayer('risk_normal', layer);
}

function initRiskScaled()
{
    const layer = new MapChloropleth({
        targetId           : layerName(DATA_NAME.risk_scaled),
        congrouenceClasses : [0,1],
        secondaryTargetId  : borderName(DATA_NAME.risk_scaled),
        source             : dataName(DATA_NAME.risk_scaled),
        fillVariable       : 'Scaled_Combined_Risk_Score',
        fillColors         : ['#FCAE91', '#FB6A4A', '#DE2D26', '#A50F15'],
        intervals          : INTERVALS[DATA_NAME.risk_scaled],
        border_color       : 'black',
        border_width       : 0.25,
        duration           : 250
    });
    const trigger = createTrigger('trigger-secondary-risk_scaled', 2);
    trigger.addAnimElem({type: 'click', anim: layer});

    const riskScaledHtml = (feature) => {
        const prop = feature.properties;

        return  `
            <h2>Raw Risk Score</h2>
            <p>Census Subdivision: ${prop['CSDNAME']}</p>
            <p>Scaled Risk Score: ${prop['Scaled_Combined_Risk_Score']}</p>
            <p>Average PM2.5 concentration: ${roundDec(parseFloat(prop['Average PM2.5 concentration']), roundTo)}</p> 
            `;
    };
    initPopupForLayer('risk_scaled', riskScaledHtml);
    initLegendForLayer('risk_scaled', layer);
}

function initAssessChoose(isFirst)
{
    const letter = isFirst ? 'a' : 'b';
    const text1 = new SwappableText(`text-0-secondary-assess-choose-${letter}`, [0,4]);
    const text2 = new SwappableText(`text-1-secondary-assess-choose-${letter}`, [0,1]);
    const text3 = new SwappableText(`text-2-secondary-assess-choose-${letter}`, [1,2]);
    const text4 = new SwappableText(`text-3-secondary-assess-choose-${letter}`, [2,3]);
    const text5 = new SwappableText(`text-4-secondary-assess-choose-${letter}`, [3,4]);

    const trigger = createTrigger(`trigger-secondary-assess-choose-${letter}`, 5);
    trigger.addAnimElem({type: 'click', anim: text2});
    trigger.addAnimElem({type: 'click', anim: text3});
    trigger.addAnimElem({type: 'click', anim: text4});
    trigger.addAnimElem({type: 'click', anim: text5});
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

function initInfos()
{
    for (let i=0; i!=9; ++i)
    {
        const emptyAnim     = new Empty(null, [0]);
        const filterHover   = new HoverLagFilter();
        const counter       = new EnterCounter(`trigger-text-info-${i}`); // use to disable text until info hovered

        const menuSecond    = new StaticHiglightableHover(`result-text-info-${i}`, [0]);
        
        const trigger = createTrigger(`trigger-text-info-${i}`, 1);
        // trigger.addAnimElem({type: 'click', anim: menuSecond});
        trigger.addAnimElem({type: 'enter', anim: menuSecond, filter: counter});
        trigger.addAnimElem({type: 'leave', anim: menuSecond, filter: filterHover, delay: 1000});
    
        // account for both cases of hiding info text
        //  1. leave button and dont enter secondary text
        //  2. leave secondary text
        const fakeTrigger = createTrigger(`result-text-info-${i}`, 1);
        fakeTrigger.addAnimElem({type: 'enter', anim: emptyAnim, filter: new AndFilter([counter, filterHover])});
        fakeTrigger.addAnimElem({type: 'leave', anim: menuSecond, filter: counter});
    }
}

function initMap()
{
    // TODO:
    // to multiplex create a filter which forcefully transitions the previous on
    //      if it exists
    // everything you want to be part of the multiplexer will use the filter, filter
    //      should always return true

    // enviornmental indicator layers
    initWaterTreatment(); // first so hover is on bottom
    initAirStations();
    initContaimatedSites();

    // demographic statistic layers
    initImmigrant();
    initIncome();
    initMinority();

    // enviornmental risk scores
    initRiskNormal()
    initRiskScaled();

    // assessment menu
    initAssessChoose(true);
    initAssessChoose(false);
    initAssessQuartile(true);
    initAssessQuartile(false);
    initAssessOp();
    initAssessRun();

    // all infos
    initInfos();
}