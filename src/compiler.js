'use strict';

const Parser = require('./parser.js');
const { generate } = require('./codegenerator.js');

const compile = (input) => {
  const output = [];
  const parser = new Parser(input);
  while (parser.lookAhead(0).type !== 'EOF') {
    const ast = parser.parseExpression();
    output.push(generate(ast));
  }
  return output.join('');
};

module.exports = {
  compile,
};
