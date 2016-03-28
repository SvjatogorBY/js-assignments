'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width=width;
    this.height=height;
    this.getArea = function(){
        return width*height;
    }
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    /*var obj = JSON.parse(json);
    obj.["__proto__"] = proto;
    return obj;*/

    throw new Error('Not implemented');
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

/* initialState { propName: "", propValue: "" }
 */

var selectorPrototype = {
    element: function(value) {
        if(this.elementName) throw "Element, id and pseudo-element should not occur more then one time inside the selector";
        if(this.idName || this.className || this.attrName || this.pseudoClassName || this.pseudoElementName)
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
        this.elementName = value;
        return this;
    },

    id: function(value) {
        if(this.idName) throw "Element, id and pseudo-element should not occur more then one time inside the selector";
        if(this.className || this.attrName || this.pseudoClassName || this.pseudoElementName)
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
        this.idName = value;
        return this;
    },

    class: function(value) {
        if(this.attrName || this.pseudoClassName || this.pseudoElementName)
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
        if(!this.className) this.className = [value];
        else this.className.push(value);
        return this;
    },

    attr: function(value) {
        if(this.pseudoClassName || this.pseudoElementName)
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
        if(!this.attrName) this.attrName = [value];
        else this.attrName.push(value);
        return this;
    },

    pseudoClass: function(value) {
        if(this.pseudoElementName)
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";
        if(!this.pseudoClassName) this.pseudoClassName = [value];
        else this.pseudoClassName.push(value);
        return this;
    },

    pseudoElement: function(value) {
        if(this.pseudoElementName) throw "Element, id and pseudo-element should not occur more then one time inside the selector";
        this.pseudoElementName = value;
        return this;
    },

    stringify: function() {
        return (this.elementName ? this.elementName : '') +
            (this.idName ? `#${this.idName}` : '') +
            (this.className ? `.${this.className.join('.')}` : '') +
            (this.attrName ? `[${this.attrName.join(',')}]` : '') +
            (this.pseudoClassName ? `:${this.pseudoClassName.join(':')}` : '') +
            (this.pseudoElementName ? `::${this.pseudoElementName}` : '');
    }
};

function Selector(initialState)
{
    this[initialState.propName + "Name"] = initialState.propValue;
    this["__proto__"] = selectorPrototype;
}

function InitialState(propName,propValue)
{
    this.propName = propName;
    this.propValue = propValue;
}

function PropertyGroup(value)
{
    this.data = value;

    this.stringify = function()
    {
        return this.data;
    }
}

const cssSelectorBuilder = {

    element: function(value) {
        return new Selector(new InitialState('element',value));
    },

    id: function(value) {
        return new Selector(new InitialState('id',value));
    },

    class: function(value) {
        return new Selector(new InitialState('class',[value]));
    },

    attr: function(value) {
        return new Selector(new InitialState('attr',[value]));
    },

    pseudoClass: function(value) {
        return new Selector(new InitialState('pseudoClass',[value]));
    },

    pseudoElement: function(value) {
        return new Selector(new InitialState('pseudoElement',value));
    },

    combine: function(selector1, combinator, selector2) {
        return new PropertyGroup(`${selector1.stringify()} ${combinator} ${selector2.stringify()}`);
    },
};

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
