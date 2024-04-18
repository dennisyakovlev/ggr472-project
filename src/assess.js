/*  following must logically correspond to what is in the HTML
*/
const chooseStateMapping = [
    DATA_NAME.immigrant,
    DATA_NAME.income,
    DATA_NAME.minority,
    DATA_NAME.risk_normal,
    DATA_NAME.risk_scaled
];
const assessLayerValName = [
    'total_immi_pct',
    'low_income_pct',
    'visible_minority_pct',
    'Combined_Risk_Score',
    'Scaled_Combined_Risk_Score'
];

class Assesser extends Animatable
{
    _getTriggerState(isFirst)
    {
        const letter = isFirst ? 'a' : 'b';
        const trigger = createTrigger(`trigger-secondary-assess-choose-${letter}`, 5);
        return trigger.getState('click');
    }

    _getDataName(isFirst)
    {
        return dataName(chooseStateMapping[this._getTriggerState(isFirst)]);
    }

    constructor(targetId, congrouenceClasses, mapPoly)
    {
        super(targetId, congrouenceClasses);

        this.mapPoly = mapPoly; // to rerender ?
    }

    _getQuantileTriggerStates(isFirst)
    {
        const letter = isFirst ? 'a' : 'b';
        const states = [-1,-1,-1,-1];
        
        for (let i=0; i!=4; ++i)
        {
            const trigger = createTrigger(`trigger-secondary-assess-quartile-${letter}-${i}`, 2);
            states[i] = trigger.getState('click');
        }
        
        return states;
    }

    transition(type, state)
    {
        const stateA    = this._getTriggerState(true);
        const stateB    = this._getTriggerState(false);
        const dataA     = DATA[this._getDataName(true)].features;
        const dataB     = DATA[this._getDataName(false)].features;
        const dataLayer = DATA[this.mapPoly.source].features;
        const triggerA  = this._getQuantileTriggerStates(true);
        const triggerB  = this._getQuantileTriggerStates(false);
        const op        = createTrigger('trigger-secondary-assess-op', 2).getState('click') % 2 == 0
            ? (a,b) => a && b
            : (a,b) => a || b;

        if (dataA.length != dataB.length || dataB.length != dataLayer.length)
            throw new Error(`all length must be equal [${dataA.length}] [${dataB.length}] [${dataLayer.length}]`);

        for (let i=0; i!=dataLayer.length; ++i)
        {
            if (dataA[i].properties.CSDAME != dataB[i].properties.CSDAME ||
                dataB[i].properties.CSDAME != dataLayer[i].properties.CSDAME)
            {
               throw new Error(`subdivisions should all be ordered, issue at [${i}] with
                                [${dataA[i].properties.CSDAME}]
                                [${dataB[i].properties.CSDAME}]
                                [${dataLayer[i].properties.CSDAME}]`); 
            }

            const intervalA = INTERVALS[chooseStateMapping[stateA]].findIndex(
                e => dataA[i].properties[assessLayerValName[stateA]] <= e);
            const intervalB = INTERVALS[chooseStateMapping[stateB]].findIndex(
                e => dataB[i].properties[assessLayerValName[stateB]] <= e);
            
            dataLayer[i].properties.binary_val = op(triggerA[intervalA], triggerB[intervalB]);
        }

        map.getSource(this.mapPoly.source).setData(DATA[this.mapPoly.source]);
    }
};
