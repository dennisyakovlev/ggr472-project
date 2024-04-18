/*  following must logically correspond to what is in the HTML
*/
const chooseStateMapping = [
    DATA_NAME.immigrant,
    DATA_NAME.income,
    DATA_NAME.minority,
    // DATA_NAME.risk ???
];

class Assesser extends Animatable
{
    _getDataName(isFirst)
    {
        const letter = isFirst ? 'a' : 'b';
        const trigger = createTrigger(`trigger-secondary-assess-choose-${letter}`, 4);
        return chooseStateMapping[trigger.getState('click')];
    }

    constructor(targetId, congrouenceClasses, mapPoly)
    {
        super(targetId, congrouenceClasses);

        this.mapPoly = mapPoly; // to rerender ?
    }

    transition(type, state)
    {
        const dataA = this._getDataName(true);
        const dataB = this._getDataName(false);


        /*  need the data for which were going to run through

            go through one census tract at a time, see it meets
            criterea then set the actual data value to 1

            can just have mappoly with 2 interval, 0/1 for some
            datafield
        */
        console.log(dataA);
        console.log(dataB);
    }
};
