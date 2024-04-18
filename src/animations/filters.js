/*  filters are used in animatables to determine whether
    to actually cycle an element
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
            res = res || filter.check(type, states);
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

    check(type, states)
    {
        let res = true;
        for (const filter of this.filters)
            res = res && filter.check(type, states);
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

    check(type, states)
    {
        return !this.filter.check(type, states);
    }
};
