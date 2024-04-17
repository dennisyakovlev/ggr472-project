const _animatables = {};

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
            console.log(`doing ${type} for ${this.triggerId}`)
            const oldStates = structuredClone(this.states);
            setTimeout(e => {
                if (obj.filter == null || obj.filter.check(type, oldStates))
                {
                    obj.instance.transition(type, oldStates[type]);
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
        and run added animations on a [modulo] cycle 
    */
    constructor(triggerId, modulo)
    {
        console.assert(modulo >= 1);
        this.modulo = modulo;

        this.triggerId = triggerId;
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
        _animatables[this.triggerId] = this;

        // we want to pass down e so forced to use function(e) instead of e =>
        //      as using this in later gives class instance
        // we also want to call [_doAction] on the instance, use _animatables
        $(`#${this.triggerId}`).on('click', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'click');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
        $(`#${this.triggerId}`).on('mouseenter', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'enter');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
        $(`#${this.triggerId}`).on('mouseleave', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'leave');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
        $(`#${this.triggerId}`).on('mouseover', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'over');
            else throw new Error(`didn't find ${id} in _animatables`)
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
            console.assert(0 <= congClass && congClass < this.modulo && seen.has(congClass) === false);
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
        this.elem        = $(`#${this.targetId}`);
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

/*  menu which turns on and off. animation looks like
    vertical sliding
*/
class VerticalMenu extends Animatable
{
    _verifyInit()
    {
        const classes = $(this.elem).attr('class').split(/\s+/);
        for (const reqClass of ['vertical-menu-anim-start', 'no-pointer'])
            if (classes.find(e => e == reqClass) === undefined)
                return false;
        
        return true;
    }

    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        console.assert(this._verifyInit());
    }

    transition(type, congClass)
    {
        if (congClass == this.congClasses[0]) // on
            $(this.elem)
                .removeClass('vertical-menu-anim-mid vertical-menu-anim-out no-pointer')
                .addClass(`vertical-menu-anim-in vertical-menu-anim-start`);
        if (congClass == this.congClasses[1]) // off
            $(this.elem)
                .removeClass('vertical-menu-anim-start vertical-menu-anim-in')
                .addClass('vertical-menu-anim-mid vertical-menu-anim-out no-pointer');
    }
};

/*  menu which turns on and off. animation looks like
    horizontal sliding
*/
class horizontalMenu extends Animatable
{
    _verifyInit()
    {
        const classes = $(this.elem).attr('class').split(/\s+/);
        for (const reqClass of ['horizontal-menu-anim-start', 'no-pointer'])
            if (classes.find(e => e == reqClass) === undefined)
                return false;
        
        return true;
    }

    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        console.assert(this._verifyInit());
    }

    transition(type, congClass)
    {
        console.log('transitioning', type)
        if (type == 'enter' || (type == 'click' && congClass == 0)) // on
            $(this.elem)
                .removeClass('horizontal-menu-anim-mid horizontal-menu-anim-out no-pointer')
                .addClass(`horizontal-menu-anim-in horizontal-menu-anim-start`);
        if (type == 'leave' || (type == 'click' && congClass == 1)) // off
            $(this.elem)
                .removeClass('horizontal-menu-anim-start horizontal-menu-anim-in')
                .addClass('horizontal-menu-anim-mid horizontal-menu-anim-out no-pointer');
    }
};

/*  an animation which slides text in from the left and
    slides out to the right. opacity is also transitioned
*/
class SwappableText extends Animatable
{

    _verifyInit()
    {
        const classes = $(this.elem).attr('class').split(/\s+/);
        for (const reqClass of ['text-anim-start'])
            if (classes.find(e => e == reqClass) === undefined)
                return false;
        
        return true;
    }

    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        console.assert(this._verifyInit());
    }

    transition(type, congClass)
    {
        if (congClass == this.congClasses[0]) // on
            $(this.elem)
                .removeClass('text-anim-mid text-anim-out no-pointer')
                .addClass(`text-anim-in text-anim-start`);
        if (congClass == this.congClasses[1]) // off
            $(this.elem)
                .removeClass('text-anim-start text-anim-in')
                .addClass('text-anim-mid text-anim-out no-pointer');
    }

};

/*  animation which switches the opacity of an element between
    0 and 1
*/
class Higlightable extends Animatable
{

    _verifyInit()
    {
        const classes = $(this.elem).attr('class').split(/\s+/);
        for (const reqClass of ['background-anim-start'])
            if (classes.find(e => e == reqClass) === undefined)
                return false;
        
        return true;
    }

    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        console.assert(this._verifyInit());
    }

    transition(type, congClass)
    {
        if (congClass == this.congClasses[0]) // on
            $(this.elem)
                .removeClass('background-anim-mid background-anim-out no-pointer')
                .addClass(`background-anim-in background-anim-start`);
        if (congClass == this.congClasses[1]) // off
            $(this.elem)
                .removeClass('background-anim-start background-anim-in')
                .addClass('background-anim-mid background-anim-out no-pointer');
    }
};

class Empty extends Animatable
{
    transition()
    {

    }
};
