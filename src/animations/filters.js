/*  filters are used in animatables to determine whether
    to actually cycle an element. these can be stateful or
    stateless. that is, might need new instance of filter
    for every trigger (stateful)
*/
class Filter
{

    /*  [states] is all states on the transitionable
    
        return true if should cycle, false if skip
    */
    check(type, states)
    {
        throw new Error('must be implemented');
    }

};

/*  when mouse is currently over do cycle, else do not cycle
*/
class IsHoverOverFilter extends Filter
{
    constructor(id)
    {
        super();

        this.id    = id;
        this.elem  = $(`#${this.id}`);
        this.enter = 0;
        this.leave = 0;

        $(this.elem).on('mouseenter', e => ++this.enter);
        $(this.elem).on('mouseleave', e => ++this.leave);
    }

    check(type, states)
    {
        return this.enter != this.leave;
    }
};

/*  when toggles click state is on, cycle element
*/
class ClickOnFilter extends Filter
{

    check(type, states)
    {
        return states.click % 2;
    }

};

class OrFilter extends Filter
{
    constructor(filters)
    {
        super();

        this.filters = filters;
    }

    check(type, states)
    {
        let res = false;
        for (const filter of this.filters)
            res = res || filter.check(type, states, e);
        return res;
    }
};

class AndFilter extends Filter
{
    constructor(filters)
    {
        super();

        this.filters = filters;
    }

    check(type, states,e )
    {
        let res = true;
        for (const filter of this.filters)
            res = res && filter.check(type, states, e);
        return res;
    }
};

class NotFilter extends Filter
{
    constructor(filter)
    {
        super();

        this.filter = filter;
    }

    check(type, states, e)
    {
        return !this.filter.check(type, states,e );
    }
};

/*  do cycle if did not enter the dom element
*/
class HoverLagFilter extends Filter
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

/*  return number of times enter
*/
class EnterCounter extends Filter
{
    constructor(trackId)
    {
        super();

        this.times   = 0;
        this.trackId = trackId;
    }

    check(type, states, e)
    {
        const old = this.times;

        console.log(type, e)
        if (type == 'enter' && e.target.id == this.trackId)
            this.times += 1;
        
        return this.times == 0 ? false : true;
        // old == 0 ? false : true;
    }
};
