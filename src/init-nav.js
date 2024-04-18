/*  do cycle if did not enter the secondary menu
*/
class HorizontalFilter extends Filter
{
    constructor()
    {
        super();

        this.enterd = false;
    }

    check(type, states)
    {
        console.assert(type == 'leave' || type == 'enter');

        if (type == 'enter')
        {
            this.enterd = true;
            return;
        }

        const old = this.enterd;
        this.enterd = false;
        return !old;
    }
};

/*  create a seconary menu with the assumption its been
    correctly set up in the html. asserts should catch anything
    missing or wrong
*/
function initSecondaryMenu(name)
{
    const clickOnFilter = new ClickOnFilter();
    const emptyAnim     = new Empty(null, [0]);

    const filterHoriz   = new HorizontalFilter();
    const startText     = new SwappableText(`text-a-secondary-${name}`, [0,1]);
    const afterText     = new SwappableText(`text-b-secondary-${name}`, [0,1]);
    const menuSecond    = new horizontalMenu(`horizontal-menu-secondary-${name}`, [0,1]);
    const menuSecondB   = new horizontalMenu(`horizontal-menu-secondary-${name}`, [0]); 
    
    const trigger = createTrigger(`trigger-secondary-${name}`, 2);
    trigger.addAnimElem({type: 'click', anim: afterText});
    trigger.addAnimElem({type: 'click', anim: menuSecond});
    trigger.addAnimElem({type: 'enter', anim: menuSecond, filter: clickOnFilter});
    trigger.addAnimElem({type: 'leave', anim: menuSecond, filter: new AndFilter([filterHoriz, clickOnFilter]), delay: 500});

    // account for both cases of closing secondary menu
    //  1. leave button and dont enter secondary menu
    //  2. leave secondary menu
    const fakeTrigger = createTrigger(`horizontal-menu-secondary-${name}`, 1);
    fakeTrigger.addAnimElem({type: 'enter', anim: emptyAnim, filter: filterHoriz})
    fakeTrigger.addAnimElem({type: 'leave', anim: menuSecondB});

    // offset initial text
    const afterId = trigger.addAnimElem({type: 'click', anim: startText});
    trigger.forceCycle('click', afterId, 1);
    startText.rotateRightClasses(1);
}

/*  create a navigation bar button with assumption has been
    correctly set up in html
*/
function initNavTrigger(name)
{
    const navMenuvertical   = new VerticalMenu(`vertical-menu-${name}`, [0,1]);
    const navBtnHighlight   = new Higlightable(`background-nav-${name}`, [0,1]);

    const navTransitionable = createTrigger(`trigger-nav-${name}`, 2);
    navTransitionable.addAnimElem({type: 'click', anim: navMenuvertical});
    navTransitionable.addAnimElem({type: 'click', anim: navBtnHighlight});
}

function initNavBar()
{
    initNavTrigger('env');
    initSecondaryMenu('sites');
    initSecondaryMenu('water');
    initSecondaryMenu('air');

    initNavTrigger('demo');
    initSecondaryMenu('immi');
    initSecondaryMenu('income');
    initSecondaryMenu('minority');
}