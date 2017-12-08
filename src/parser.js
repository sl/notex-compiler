'use strict';

const { prefix, infix } = require('./parselets.js');
const Lexer = require('./lexer.js');

/**
 * A Pratt parser for the NoTeX language.
 */
class Parser {
  /**
   * constructor - Creates a new Parser.
   * @param  {String} input - The input to the parser
   */
  constructor(input) {
    this.lexer = new Lexer(input);
    this.read = this.lexer.lex();
  }

  /**
   * lookAhead - Gets the token the specified distance away from the parse head.
   *
   * @param  {Number} distance The distance to look ahead.
   * @return {Token}           The retrieved token.
   */
  lookAhead(distance) {
    if (this.read.length <= distance) {
      return {
        type: 'EOF',
        value: '',
      };
    }
    return this.read[distance];
  }

  /**
   * consume - Consumes a token.
   * @param {String} type The type of the expected token if one is expected.
   * @return {Token}      The consumed token.
   */
  consume(type) {
    const token = this.lookAhead(0); // ensure the token has been read
    if (type) {
      if (token.type !== type) {
        throw new Error(`Expected token of type: ${type}, got: ${token.type}`);
      }
    }
    return this.read.splice(0, 1)[0];
  }

  /**
   * getPrecedence - Gets the precedence of the operator being parsed,
   * or zero if the operator is not infix.
   *
   * @return {Number}  The precedence of the operator being parsed.
   */
  getPrecedence() {
    const { type } = this.lookAhead(0);
    if (type in infix) {
      return infix[type].precedence;
    }
    return 0;
  }


  /**
   * parseExpression - Parses the next expression from the stream of
   *                   tokens emmitted by the lexer.
   * @param {Number} precedence - The precedence to use (defaults to zero)
   * @return {Expression}  The parsed expression.
   */
  parseExpression(precedence = 0) {
    let token = this.consume();
    const prefixParselet = prefix[token.type];
    if (!prefixParselet) {
      throw new Error(`Could not parse "${token.value}".`);
    }
    let left = prefixParselet.parse(this, token);
    while (precedence < this.getPrecedence()) {
      token = this.consume();

      const infixParselet = infix[token.type];
      left = infixParselet.parse(this, left, token);
    }

    return left;
  }
}

module.exports = Parser;
