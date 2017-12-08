'use strict';

const { getPunctuator, getBreakingPunctuator } = require('./punctuators.js');

/**
 * The Lexer Module.
 * @module lexer
 */

/**
 * @typedef {Object} Token
 * @property {String} - The type of the token.
 * @property {Value} - The value of the token.
 */

/**
 * A lexer for the NoTeX language.
 */
class Lexer {
  /**
   * constructor - Constructs a lexer with the given input string.
   * @param  {string} input The string to lex.
   */
  constructor(input) {
    this.input = input;
    this.index = 0;
  }

  /**
   * next - Lexes up until the next token.
   *
   * @return {Token} The lexed token.
   */
  next() {
    while (this.index < this.input.length) {
      // get all of the string that has yet to be tokenized
      let remaining = this.input.substring(this.index);
      // read the next punctuator and emit it if there is one
      let punctuator = getPunctuator(remaining);
      if (punctuator) {
        this.index += punctuator.value.length;
        return punctuator;
      }
      // no punctuator was read, read until the end of the next name token
      let value = '';
      // todo -- optimize This
      do {
        value += remaining[0];
        remaining = this.input.substring(++this.index);
        punctuator = getBreakingPunctuator(remaining);
      } while (!punctuator && this.index < this.input.length);

      return {
        type: 'NAME',
        value,
      };
    }

    // at the end of the string, return EOF tokens forever to aide lookahead
    return {
      type: 'EOF',
      value: '',
    };
  }


  /**
   * lex - Lex the entire string from start to end collapsing and
   *       removing whitespace.
   *
   * @return {[Token]}  The produced tokens.
   */
  lex() {
    const tokens = [];
    let token = this.next();
    let nameValueAcc = '';
    let whitespaceAcc = '';
    while (token.type !== 'EOF') {
      if (token.type === 'NAME') {
        // collect name and whitespace to build the name token
        nameValueAcc = token.value;
        whitespaceAcc = '';
        token = this.next();
        while (token.type === 'NAME' || token.type === 'WHITESPACE') {
          if (token.type === 'NAME') {
            nameValueAcc += `${whitespaceAcc}${token.value}`;
            whitespaceAcc = '';
          } else {
            whitespaceAcc += token.value;
          }
          token = this.next();
        }
        tokens.push({
          type: 'NAME',
          value: nameValueAcc,
        });
      }
      if (token.type !== 'WHITESPACE' && token.type !== 'EOF') {
        tokens.push(token);
      }
      token = this.next();
    }

    return tokens;
  }
}

module.exports = Lexer;
