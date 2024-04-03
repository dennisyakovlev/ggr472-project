const _animatables = {};

class Animatable
{
    _doAction(e, type)
    {
        const funcs = this.states[type]%2==1 ? this.offEventsNew[type] : this.onEventsNew[type];
        this.states[type] += 1;
        for (const [id,obj] of Object.entries(funcs))
        {
            console.log(this)
            console.log(obj)
            if (obj.proto)
                obj.f.call(this, e, this.states[type]);
            else
                obj.f(e, this.states[type]);
        }
    }

    constructor(id)
    {
        this.id = id;
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
        _animatables[this.id] = this;

        // we want to pass down e so forced to use function(e) instead of e =>
        //      as using this in later gives class instance
        $(`#${this.id}`).on('click', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'click');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
        $(`#${this.id}`).on('mousenter', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'enter');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
        $(`#${this.id}`).on('mouseleave', function(e) {
            const id = $(this).attr('id');
            if (id in _animatables) _animatables[id]._doAction(e, 'leave');
            else throw new Error(`didn't find ${id} in _animatables`)
        });
    }

    addOnFunc(type, func, _asProto=false)
    {
        if (['click', 'enter', 'leave'].find(e => e == type) === undefined)
            throw new Error('invalid type');

        this.onEventsNew[type][this.onIds] = {
            f: func,
            proto: _asProto
        };
        const oldId = this.onIds;
        this.onIds += 1;
        return oldId;
    }

    addOffFunc(type, func, _asProto=false)
    {
        if (['click', 'enter', 'leave'].find(e => e == type) === undefined)
            throw new Error('invalid type');

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

    getState()
    {
        return this.state;
    }
};

class Button extends Animatable
{
    _transitionFunction(e, state)
    {   
        const children = $(e.currentTarget).children();
        const text1 = children[0];
        const text2 = children[1];

        if (state%2==1)
        {
            $(text1)
                .removeClass(`text-anim-start text-anim-in`)
                .addClass(`text-anim-mid text-anim-out`);
            $(text2)
                .removeClass(`text-anim-out`)
                .addClass(`text-anim-in`);
        }
        else
        {
            $(text1)
                .removeClass(`text-anim-mid text-anim-out`)
                .addClass(`text-anim-start text-anim-in`);
            $(text2)
                .removeClass(`text-anim-in`)
                .addClass(`text-anim-out`);
        }
    }

    enableAnim()
    {
        this.addOnFunc('click', this._transitionFunction);
        this.addOffFunc('click', this._transitionFunction);
    }

    forceTransition()
    {
        this._onClick({'currentTarget': $(`#${this.id}`)});
    }
};

class Menu extends Animatable
{
    _transitionFunction(e, state)
    {
        const children = $(e.currentTarget).parent().children();
        let content = null;
        for (const child of children)
        {
            if (child.className.includes("hamburger-menu-content"))
            {
                content = child;
                break;
            }
        }
        if (content == null)
        {
            Error('do you have menu content?');
        }

        if (state%2==1)
        {
            $(content)
                .removeClass('menu-anim-mid menu-anim-out no-pointer')
                .addClass(`menu-anim-in menu-anim-start`);
        }
        else
        {
            $(content)
                .removeClass('menu-anim-start menu-anim-in')
                .addClass('menu-anim-mid menu-anim-out no-pointer');
        }
    }

    enableAnim()
    {
        this.addOnFunc('click', this._transitionFunction);
        this.addOffFunc('click', this._transitionFunction);
    }
};

class SecondaryMenu extends Animatable
{
    constructor(id, associatedBtn, stateOffset)
    {
        super(associatedBtn.id);

        this.btn = associatedBtn;
        this.stateOffset = stateOffset;
        this.myState = 0;
    }

    _transitionFunction(e, state)
    {
        console.log('HEEEEEEEEEEEEEEEE', this)
        console.log(this.myState, this.btn)
        // parent state 1 => parent on => maybe turn on
        // current state 0 => currently off => turn on
        if ((this.btn.getState()+this.stateOffset)%2 && this.myState%2==0)
        {
            this.myState += 1;


            $(content)
                .removeClass('menu-anim-mid menu-anim-out no-pointer')
                .addClass(`menu-anim-in menu-anim-start`);
            // fire timer to throw away
        }
    }

    enableAnim()
    {
        this.addOnFunc('enter', this._transitionFunction, 1);
        this.addOffFunc('leave', this._transitionFunction, 1);
    }
};
