const _animatables = {};

class TriggeredAnimatable
{
    _doAction(e, type)
    {
        const funcs = this.states[type]%2==1 ? this.offEventsNew[type] : this.onEventsNew[type];
        this.states[type] += 1;
        for (const [id,obj] of Object.entries(funcs))
        {
            if (obj.proto != null)
                obj.f.call(obj.proto, e, this.states[type]);
            else
                obj.f(e, this.states[type]);
        }
    }

    _checkType(type)
    {
        if (['click', 'enter', 'leave'].find(e => e == type) === undefined)
            throw new Error('invalid type');
    }

    constructor(triggerId)
    {
        this.triggerId = triggerId;
        this.onEventsNew = {
            click: {},
            enter: {},
            leave: {}
        };
        this.offEventsNew = {
            click: {},
            enter: {},
            leave: {}
        };
        this.states = {
            click: 0,
            enter: 0,
            leave: 0 
        }
        this.onIds = 0;
        this.offIds = 0;
        _animatables[this.triggerId] = this;

        // we want to pass down e so forced to use function(e) instead of e =>
        //      as using this in later gives class instance
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
    }

    /*  upon action [type] execute [func] cyclically mod 2 for that
        action (ie when state conground 0 (mod 2))
        
        use _asProto if required to execute the action on a prototype
        instead of standalone
    */
    addOnFunc(type, func, _asProto=null)
    {
        this._checkType(type);

        this.onEventsNew[type][this.onIds] = {
            f: func,
            proto: _asProto
        };
        const oldId = this.onIds;
        this.onIds += 1;
        return oldId;
    }

    /*  upon action [type] execute [func] cyclically mod 2 for that
        action (ie when state conground 1 (mod 2))
        
        use _asProto if required to execute the action on a prototype
        instead of standalone
    */
    addOffFunc(type, func, _asProto=null)
    {
        this._checkType(type);

        this.offEventsNew[type][this.offIds] = {
            f: func,
            proto: _asProto
        };
        const oldId = this.offIds;
        this.offIds += 1;
        return oldId;
    }

    removeOnFunc(id)
    {
        throw new Error();
    }

    removeOnFunc(id)
    {
        throw new Error();
    }

    getState(type)
    {
        this._checkType(type);

        return this.states[type];
    }
};

/*  type of triggerable animation which will cyclically animate
    given elements congrouent to some state mod N. each state is
    per a type of transition
*/
class NthTransitionable
{
    
    _doAction(e, type)
    {
        for (const obj of this.events[this.states[type]][type])
            obj.instance.transition(this.states[type]);
        
        this.states[type] = (this.states[type] + 1) % this.modulo;
    }

    _checkType(type)
    {
        if (['click', 'enter', 'leave'].find(e => e == type) === undefined)
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
        for (var i=0; i!=this.modulo; ++i) // do not use fill since doesnt clone
            this.events.push(structuredClone({
                click: [],
                enter: [],
                leave: []
            }));
        this.states = {
            click: 0,
            enter: 0,
            leave: 0 
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
    }

    /*  [animatable] object to animate cyclically [congrouenceClass]
        and the congrouence class for which to animate it by

        return the id of the added func
    */
    addAnimElem(type, animatable)
    {
        console.assert(this._checkType(type));

        const seen = new Set();
        for (const congClass of animatable.congClasses)
        {
            console.assert(0 <= congClass && congClass < this.modulo && seen.has(congClass) === false);
            seen.add(congClass);  

            this.events[congClass][type].push({
                instance: animatable
            });
        }
        const oldId = this.offIds;
        this.offIds += 1;
        return oldId;
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
    transition(congClass)
    {
        throw new Error('implementation needed');
    }

};

// class Button extends Animatable
// {
//     _transitionFunction(e, state)
//     {   
//         const children = $(e.currentTarget).children();
//         const text1 = children[0];
//         const text2 = children[1];

//         if (state%2==1)
//         {
//             $(text1)
//                 .removeClass(`text-anim-start text-anim-in`)
//                 .addClass(`text-anim-mid text-anim-out`);
//             $(text2)
//                 .removeClass(`text-anim-out`)
//                 .addClass(`text-anim-in`);
//         }
//         else
//         {
//             $(text1)
//                 .removeClass(`text-anim-mid text-anim-out`)
//                 .addClass(`text-anim-start text-anim-in`);
//             $(text2)
//                 .removeClass(`text-anim-in`)
//                 .addClass(`text-anim-out`);
//         }
//     }

//     enableAnim()
//     {
//         this.addOnFunc('click', this._transitionFunction);
//         this.addOffFunc('click', this._transitionFunction);
//     }

//     forceTransition()
//     {
//         // this._onClick({'currentTarget': $(`#${this.triggerId}`)});
//         this._doAction({'currentTarget': $(`#${this.triggerId}`)}, 'click');
//     }
// };

// class Menu extends Animatable
// {
//     _transitionFunction(e, state)
//     {
//         const children = $(e.currentTarget).parent().children();
//         let content = null;
//         for (const child of children)
//         {
//             if (child.className.includes("hamburger-menu-content"))
//             {
//                 content = child;
//                 break;
//             }
//         }
//         if (content == null)
//         {
//             Error('do you have menu content?');
//         }

//         if (state%2==1)
//         {
//             $(content)
//                 .removeClass('menu-anim-mid menu-anim-out no-pointer')
//                 .addClass(`menu-anim-in menu-anim-start`);
//         }
//         else
//         {
//             $(content)
//                 .removeClass('menu-anim-start menu-anim-in')
//                 .addClass('menu-anim-mid menu-anim-out no-pointer');
//         }
//     }

//     enableAnim()
//     {
//         this.addOnFunc('click', this._transitionFunction);
//         this.addOffFunc('click', this._transitionFunction);
//     }
// };

// class SecondaryMenu extends Animatable
// {
//     constructor(id, associatedBtn, stateOffset)
//     {
//         super(id);

//         this.myId = id;
//         this.btn = associatedBtn;
//         this.stateOffset = stateOffset;
//         this.myState = 0;
//     }

//     _transitionFunction(e, state)
//     {
//         if (e === 'special')
//         {
//             this.btn.states.enter -= 1;
//         }

//         // parent state 1 => parent on => maybe turn on
//         // current state 0 => currently off => turn on
//         if ((this.btn.getState('click')+this.stateOffset)%2 && this.myState%2==0)
//         {
//             this.myState += 1;

//             const me = $(`#${this.myId}`);
//             me
//                 .removeClass('menu-anim-mid menu-anim-out no-pointer')
//                 .addClass(`menu-anim-in menu-anim-start`);
            
//                 // fire timer to hide
//             const timer = setInterval((e2) => {
//                 if ((this.getState('enter') == this.getState('leave')) &&
//                     (this.btn.getState('enter') == this.btn.getState('leave')))
//                 {
//                     this.myState += 1;

//                     me
//                         .removeClass('menu-anim-start menu-anim-in')
//                         .addClass('menu-anim-mid menu-anim-out no-pointer');

//                     clearInterval(timer);
//                 }
//             }, 400);
//         }
//     }

//     forceTransition()
//     {
//         this.btn._doAction('special', 'enter');
//     }

//     enableAnim()
//     {
//         // need to increment state to use in if checks in our transition
//         // func, so use empty functions
//         this.addOnFunc('enter', (e, state) => {});
//         this.addOnFunc('leave', (e, state) => {});

//         // want same behaviour both times
//         this.btn.addOnFunc('enter', this._transitionFunction, this);
//         this.btn.addOffFunc('enter', this._transitionFunction, this);
//     }
// };

// class DropDownMenuItem extends Animatable
// {
//     _transitionFunction(e, state)
//     {

//         const children = $(e.currentTarget).parent().children();
//         let content = null;
//         for (const child of children)
//         {
//             if (child.className.includes("hamburger-menu-content"))
//             {
//                 content = child;
//                 break;
//             }
//         }
//         if (content == null)
//         {
//             Error('do you have menu content?');
//         }

//         if (state%2==1)
//         {
//             $(content)
//                 .removeClass('menu-anim-mid menu-anim-out no-pointer')
//                 .addClass(`menu-anim-in menu-anim-start`);
//         }
//         else
//         {
//             $(content)
//                 .removeClass('menu-anim-start menu-anim-in')
//                 .addClass('menu-anim-mid menu-anim-out no-pointer');
//         }
//     }

//     enableAnim()
//     {
//         this.addOnFunc('click', this._transitionFunction);
//         this.addOffFunc('click', this._transitionFunction);
//     }
// };

/*  menu which turns on and off. animation looks like
    many seperate elements sliding down together
*/
class DropDownMenu extends Animatable
{
    _verifyInit()
    {
        /*  require these classes to be on the dom element within
            the html on launch
        */
        const classes = $(this.elem).attr('class').split(/\s+/);
        for (const reqClass of ['dropdown-anim-start', 'no-pointer'])
            if (classes.find(e => e == reqClass) === undefined)
                return false;
        
        return true;
    }

    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        console.assert(this._verifyInit());
    }

    transition(congClass)
    {
        if (congClass == this.congClasses[0]) // on
            $(this.elem)
                .removeClass('dropdown-anim-mid dropdown-anim-out no-pointer')
                .addClass(`dropdown-anim-in dropdown-anim-start`);
        if (congClass == this.congClasses[1]) // off
            $(this.elem)
                .removeClass('dropdown-anim-start dropdown-anim-in')
                .addClass('dropdown-anim-mid dropdown-anim-out no-pointer');
    }
};

class SwappableTextButton extends Animatable
{

};

class HiglightableButton extends Animatable
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

    transition(congClass)
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
