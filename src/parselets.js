'use strict';

const precedenceList = [
  'KEYWORD',
  'TO',
  'COMMA',
  'COMPARISON',
  'LP_PRODUCT',
  'SUM',
  'DIVISION',
  'PRODUCT',
  'EXPONET',
  'SCRIPT',
  'PREFIX',
  'POSTFIX',
];

/**
 * Precedence values for different types of parselets.
 */
const p = {};
precedenceList.forEach((value, rank) => {
  // precedence values should start at one, so add one to convert
  // from array index to precedence for the name at that index
  p[value] = rank + 1;
});

const postfix = (precedence) => {
  return {
    precedence,
    parse: (parser, left, token) => {
      return {
        type: 'POSTFIX',
        operator: token.type,
        value: left,
      };
    },
  };
};

const prefix = (precedence) => {
  return {
    parse: (parser, token) => {
      const right = parser.parseExpression(precedence);
      return {
        type: 'PREFIX',
        operator: token.type,
        value: right,
      };
    },
  };
};

const infix = (precedence, isRightAssociative) => {
  return {
    precedence,
    parse: (parser, left, token) => {
      const newPrecedence = precedence - (isRightAssociative ? 0 : 1);
      const right = parser.parseExpression(newPrecedence);
      return {
        type: 'BINARY',
        operator: token.type,
        left,
        right,
      };
    },
  };
};

const infixLeft = precedence => infix(precedence, false);

const infixRight = precedence => infix(precedence, true);

const boundedOperation = (precedence, name) => {
  return {
    precedence,
    parse: (parser) => {
      const bounds = [];
      while (parser.lookAhead(0).type !== 'OF') {
        const next = parser.parseExpression();
        bounds.push(next);
        if (parser.lookAhead(0).type !== 'OF') {
          parser.consume('COMMA');
        }
      }
      parser.consume('OF');
      const body = parser.parseExpression();
      return {
        type: 'BOUNDED',
        operator: name,
        bounds,
        value: body,
      };
    },
  };
};

// the final parselet list

const prefixParselets = {
  LEFT_PAREN: {
    precedence: p.PREFIX,
    parse: (parser) => {
      const expression = parser.parseExpression();
      parser.consume('RIGHT_PAREN');
      return expression;
    },
  },
  ESCAPE: prefix(p.PREFIX),
  PLUS: prefix(p.PREFIX), // handles prefix + (indicating positive)
  MINUS: prefix(p.PREFIX), // handles prefix - (indicating negative)
  NAME: {
    precedence: p.PREFIX,
    parse: (parser, token) => {
      return {
        type: 'RAW',
        value: token.value,
      };
    },
  },
  INTEGRAL: boundedOperation(p.prefix, 'INTEGRAL'),
  SUM: boundedOperation(p.prefix, 'SUM'),
  PRODUCTION: boundedOperation(p.prefix, 'PRODUCTION'),
  SUPER: prefix(p.PREFIX),
  SUB: prefix(p.PREFIX),
};

const infixParselets = {
  EQUAL: infixRight(p.COMPARISON),
  GEQ: infixRight(p.COMPARISON),
  LEQ: infixRight(p.COMPARISON),
  NEQ: infixRight(p.COMPARISON),
  APPROX: infixRight(p.COMPARISON),
  TO: infixLeft(p.TO),
  PLUS: infixLeft(p.SUM),
  MINUS: infixLeft(p.SUM),
  LP_TIMES: infixLeft(p.LP_PRODUCT),
  TIMES: infixLeft(p.PRODUCT),
  DIVIDE: infixLeft(p.DIVISION),
  SUPER: infixLeft(p.EXPONENT),
  SUB: infixLeft(p.EXPONENT),
  AT: postfix(p.POSTFIX),
  MESH: postfix(p.POSTFIX),
};

module.exports = {
  prefix: prefixParselets,
  infix: infixParselets,
};
