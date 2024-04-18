const _triggers = {};

/*  type of triggerable animation which will cyclically animate
    given elements congrouent to some state mod N. each state is
    per a type of transition
*/
class NthTransitionable
{
    
    _doAction(e, type)
    {
        for (const obj of this.events[this.states[type]][type])
        {
            const oldStates = structuredClone(this.states);
            setTimeout(et => {
                if (obj.filter == null || obj.filter.check(type, oldStates, e))
                {
                    obj.instance.transition(type, oldStates[type], e);
                }
            }, obj.delay);
        }
        
        this.states[type] = (this.states[type] + 1) % this.modulo;
    }

    _idToAnim(type, id)
    {
        for (let congClass=0; congClass!=this.modulo; ++congClass)
        {
            const anim = this.events[congClass][type].filter(e => e.id === id);
            if (anim.length != 0)
                return anim[0];
        }

        throw new Error(`could not find id [${id}] for type [${type}]`);
    }

    _checkType(type)
    {
        if (['click', 'enter', 'leave', 'over'].find(e => e == type) === undefined)
            return false;
        return true;
    }

    /*  increment state for dom element with id [triggerId]
        and run added animations on a [modulo] cycle.
    */
    constructor(triggerId, modulo)
    {
        console.assert(modulo >= 1);
        console.assert(!_triggers.hasOwnProperty(triggerId));

        this.modulo = modulo;

        this.triggerId = triggerId;
        this.element   = $(`#${this.triggerId}`);
        this.events = [];
        for (let i=0; i!=this.modulo; ++i) // do not use fill since doesnt clone
            this.events.push(structuredClone({
                click: [],
                enter: [],
                leave: [],
                over:  []
            }));
        this.states = {
            click: 0,
            enter: 0,
            leave: 0,
            over:  0
        }
        this.ids = 0;
        _triggers[this.triggerId] = this;

        // we want to pass down e so forced to use function(e) instead of e =>
        //      as using this in later gives class instance
        // we also want to call [_doAction] on the instance, use _triggers
        this.element.on('click', function(e) {
            const id = $(this).attr('id');
            if (id in _triggers) _triggers[id]._doAction(e, 'click');
            else throw new Error(`didn't find ${id} in _triggers`)
        });
        this.element.on('mouseenter', function(e) {
            const id = $(this).attr('id');
            if (id in _triggers) _triggers[id]._doAction(e, 'enter');
            else throw new Error(`didn't find ${id} in _triggers`)
        });
        this.element.on('mouseleave', function(e) {
            const id = $(this).attr('id');
            if (id in _triggers) _triggers[id]._doAction(e, 'leave');
            else throw new Error(`didn't find ${id} in _triggers`)
        });
        this.element.on('mouseover', function(e) {
            const id = $(this).attr('id');
            if (id in _triggers) _triggers[id]._doAction(e, 'over');
            else throw new Error(`didn't find ${id} in _triggers`)
        });
    }

    /*  [animatable] object to animate cyclically [congrouenceClass]
        andSwappableText the congrouence class for which to animate it by.
        is per a type
        [filt] is filter to apply directly before cycle fires
        [dela] is delay in millisecond for which to wait until attempting
               to cycle the animatable. the old state is given to the [filt]
               if there is one given. likewise with the [animatable]

        return the id of the added animatable
    */
    addAnimElem({
        type    = null,
        anim    = null,
        filter  = null,
        delay   = 0}={})
    {
        console.assert(this._checkType(type));
        console.assert(type != null && anim != null);

        const seen = new Set();
        for (const congClass of anim.congClasses)
        {
            console.assert(0 <= congClass && congClass < this.modulo);
            console.assert(seen.has(congClass) === false);
            seen.add(congClass);

            this.events[congClass][type].push({
                instance:   anim,
                id:         this.ids,
                'filter':   filter,
                'delay':    delay
            });
        }
        const oldId = this.ids;
        this.ids += 1;
        return oldId;
    }

    /*  simulate state transition for [id] returned from addAnimElem
        by moving forward until reaching the wanted congrouence class.
        the state within this NthTransition object remains the same.

        return number of forced transitions
    */
    forceCycle(type, id, congClass)
    {
        if (this._checkType(type) == false)
            throw new Error(`given type [${type}] is bad`);

        const animatable = this._idToAnim(type, id).instance;
        let currState    = 0;
        let cycled       = 0;
        while (currState != congClass)
        {
            animatable.transition(type, currState);
            currState = (currState + 1) % this.modulo;
            ++cycled;
        }

        return cycled;
    }

    getState(type)
    {
        if (this._checkType(type) == false)
            throw new Error(`given type [${type}] is bad`);

        return this.states[type];
    }
};

/*  a dom element which can be attached to an NthTransitionable
    that will be triggerd on a cycle
*/
class Animatable
{

    /*  [targetId] of the dom element that will be animated when
        transition state is congrouent to [congrouenceClass]
    */
    constructor(targetId, congrouenceClasses)
    {
        this.targetId    = targetId;
        this.congClasses = congrouenceClasses;
    }

    /*  function to be called when cycle is reached
    */
    transition(type, congClass)
    {
        throw new Error('implementation needed');
    }

    /*  rotate the congrouence classes by some values
    */
    rotateRightClasses(val)
    {
        const len = this.congClasses.length;
        const arr = [];
        if (val < 0 || len <= val)
            throw new Error('invalid val range');

        for (let i=0; i!=len; ++i, val=(val+1)%len)
            arr.push(this.congClasses[val]);
        this.congClasses = arr;
    }
};

class Empty extends Animatable
{
    transition()
    {

    }
};

/*  create a new trigger or use an existing one
*/
function createTrigger(triggerId, congrouenceClasses)
{
    console.assert(triggerId != null);
    console.assert(congrouenceClasses != null);

    if (!_triggers.hasOwnProperty(triggerId))
        _triggers[triggerId] = new NthTransitionable(triggerId, congrouenceClasses);
    else
        if (congrouenceClasses != _triggers[triggerId].modulo)
            throw new Error(`mistach, should be exact same
                             existing [${_triggers[triggerId].modulo}],
                             want [${congrouenceClasses}]`)

    return _triggers[triggerId];
}