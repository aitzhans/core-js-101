/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
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
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
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
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// const cssSelectorBuilder = {
//   element(/* value */) {
//     throw new Error('Not implemented');
//   },

//   id(/* value */) {
//     throw new Error('Not implemented');
//   },

//   class(/* value */) {
//     throw new Error('Not implemented');
//   },

//   attr(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoClass(/* value */) {
//     throw new Error('Not implemented');
//   },

//   pseudoElement(/* value */) {
//     throw new Error('Not implemented');
//   },

//   combine(/* selector1, combinator, selector2 */) {
//     throw new Error('Not implemented');
//   },
// };


const ORDER = ['element', 'id', 'class', 'attribute', 'pseudoClass', 'pseudoElement'];

function Element(name) {
  this.selectors = `${name}`;
  this.currentSelector = 'element';
  this.prevSelector = null;
  this.elementCount = 1;
  this.idCount = 0;
  this.pseudoElemCount = 0;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}

function Id(name) {
  this.selectors = `#${name}`;
  this.currentSelector = 'id';
  this.prevSelector = null;
  this.elementCount = 0;
  this.idCount = 1;
  this.pseudoElemCount = 0;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}

function Class(name) {
  this.selectors = `.${name}`;
  this.currentSelector = 'class';
  this.prevSelector = null;
  this.elementCount = 0;
  this.idCount = 0;
  this.pseudoElemCount = 0;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}

function Attr(name) {
  this.selectors = `[${name}]`;
  this.currentSelector = 'attribute';
  this.prevSelector = null;
  this.elementCount = 0;
  this.idCount = 0;
  this.pseudoElemCount = 0;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}


function PseudoClass(name) {
  this.selectors = `:${name}`;
  this.currentSelector = 'pseudoClass';
  this.prevSelector = null;
  this.elementCount = 0;
  this.idCount = 0;
  this.pseudoElemCount = 0;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}


function PseudoElement(name) {
  this.selectors = `::${name}`;
  this.currentSelector = 'pseudoElement';
  this.prevSelector = null;
  this.elementCount = 0;
  this.idCount = 0;
  this.pseudoElemCount = 1;

  this.element = function (value) {
    if (this.elementCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'element';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `${value}`;
    return this;
  };

  this.id = function (value) {
    if (this.idCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'id';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `#${value}`;
    this.idCount += 1;
    return this;
  };

  this.class = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'class';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `.${value}`;
    return this;
  };

  this.attr = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'attribute';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `[${value}]`;
    return this;
  };

  this.pseudoClass = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoClass';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selectors += `:${value}`;
    return this;
  };

  this.pseudoElement = function (value) {
    this.prevSelector = this.currentSelector;
    this.currentSelector = 'pseudoElement';
    if (ORDER.indexOf(this.prevSelector) > ORDER.indexOf(this.currentSelector)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.pseudoElemCount > 0) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.pseudoElemCount += 1;
    this.selectors += `::${value}`;
    return this;
  };

  this.stringify = function () {
    return this.selectors;
  };
}


class Combine {
  constructor(selector1, combinator, selector2) {
    this.string = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
  }

  stringify() {
    return this.string;
  }
}


const cssSelectorBuilder = {


  element(value) {
    const elem = new Element(value);
    return elem;
  },
  id(value) {
    const elem = new Id(value);
    return elem;
  },
  class(value) {
    const elem = new Class(value);
    return elem;
  },

  attr(value) {
    const elem = new Attr(value);
    return elem;
  },

  pseudoClass(value) {
    const elem = new PseudoClass(value);
    return elem;
  },

  pseudoElement(value) {
    const elem = new PseudoElement(value);
    return elem;
  },

  combine(selector1, combinator, selector2) {
    return new Combine(selector1, combinator, selector2);
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
