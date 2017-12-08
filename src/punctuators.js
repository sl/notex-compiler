'use strict';

/**
 * Punctuator module.
 * @module punctuator
 */

/**
 * A tokenization separator used by the lexer
 * @typedef {Object} Punctuator
 * @property {String}  name      - The name of the punctuator.
 * @property {Regex}   pattern   - A pattern that recognizes the punctuator when
 *                                 it is at the start of a string.
 * @property {boolean} nameBreak - If the punctuator should terminate names.
 */

/**
 * The list of punctuators to use for tokenization.
 * @type {[Punctuator]}
 * @const
 */
const punctuators = [
  {
    name: 'INTEGRAL',
    pattern: /^int/i,
    nameBreak: false,
  },
  {
    name: 'SUM',
    pattern: /^sum/i,
    nameBreak: false,
  },
  {
    name: 'TO',
    pattern: /^to/i,
    nameBreak: false,
  },
  {
    name: 'OF',
    pattern: /^of/i,
    nameBreak: false,
  },
  {
    name: 'LEFT_PAREN',
    pattern: /^\(/,
    nameBreak: true,
  },
  {
    name: 'RIGHT_PAREN',
    pattern: /^\)/,
    nameBreak: true,
  },
  {
    name: 'EQUAL',
    pattern: /^=/,
    nameBreak: true,
  },
  {
    name: 'GEQ',
    pattern: /^>=/,
    nameBreak: true,
  },
  {
    name: 'LEQ',
    pattern: /^<=/,
    nameBreak: true,
  },
  {
    name: 'NEQ',
    pattern: /^!=/,
    nameBreak: true,
  },
  {
    name: 'APPROX',
    pattern: /^~=/,
    nameBreak: true,
  },
  {
    name: 'PLUS',
    pattern: /^\+/,
    nameBreak: true,
  },
  {
    name: 'MINUS',
    pattern: /^-/,
    nameBreak: true,
  },
  {
    name: 'LP_TIMES',
    pattern: /^\*\*/,
    nameBreak: true,
  },
  {
    name: 'TIMES',
    pattern: /^\*/,
    nameBreak: true,
  },
  {
    name: 'DIVIDE',
    pattern: /^\//,
    nameBreak: true,
  },
  {
    name: 'ESCAPE',
    pattern: /^\\/,
    nameBreak: true,
  },
  {
    name: 'COMMA',
    pattern: /^,/,
    nameBreak: true,
  },
  {
    name: 'WHITESPACE',
    pattern: /^\s/,
    nameBreak: true,
  },
  {
    name: 'SUPER',
    pattern: /^\^/,
    nameBreak: true,
  },
  {
    name: 'SUB',
    pattern: /^_/,
    nameBreak: true,
  },
  {
    name: 'AT',
    pattern: /^@/,
    nameBreak: true,
  },
  {
    name: 'MESH',
    pattern: /^#/,
    nameBreak: true,
  },
];


/**
 * Gets the next punctuator in the given string.
 * @param  {String}     remaining - The string to look for the next punctuator in.
 * @return {Punctuator}           - The next punctuator.
 */
const getPunctuator = (remaining) => {
  for (const punctuator of punctuators) {
    const result = remaining.match(punctuator.pattern);
    if (result == null) {
      continue;
    }
    return {
      type: punctuator.name,
      value: result[0],
    };
  }
  return null;
};


/**
 * Gets the next punctuator that terminates names in the given string.
 * @param  {String}     remaining - The string to look for the next punctuator in.
 * @return {Punctuator}           - The next punctuator.
 */
const getBreakingPunctuator = (remaining) => {
  for (const punctuator of punctuators) {
    const result = remaining.match(punctuator.pattern);
    if (result == null || !punctuator.nameBreak) {
      continue;
    }
    return {
      type: punctuator.name,
      value: result[0],
    };
  }
  return null;
};

module.exports = {
  punctuators,
  getPunctuator,
  getBreakingPunctuator,
};
