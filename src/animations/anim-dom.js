class DomAnimatable extends Animatable
{
    constructor(targetId, congrouenceClasses)
    {
        super(targetId, congrouenceClasses);

        this.elem = $(`#${this.targetId}`);
    }
};

/*  menu which turns on and off. animation looks like
    vertical sliding
*/
class VerticalMenu extends DomAnimatable
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
class horizontalMenu extends DomAnimatable
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
class SwappableText extends DomAnimatable
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
class Higlightable extends DomAnimatable
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
