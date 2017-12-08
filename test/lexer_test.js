'use strict';

/* global describe it */

const chai = require('chai');
const Lexer = require('../src/lexer.js');

chai.should();

describe('Lexer', () => {
  it('should tokenize a single punctuator', () => {
    const tokens = new Lexer('+').lex();
    tokens.should.be.a('array');
    tokens.should.eql([{ type: 'PLUS', value: '+' }]);
  });

  it('should tokenize a name', () => {
    const tokens = new Lexer('test').lex();
    tokens.should.be.a('array');
    tokens.should.eql([{ type: 'NAME', value: 'test' }]);
  });

  it('should tokenize an expression without names', () => {
    const tokens = new Lexer('+-*~=').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'PLUS',
        value: '+',
      },
      {
        type: 'MINUS',
        value: '-',
      },
      {
        type: 'TIMES',
        value: '*',
      },
      {
        type: 'APPROX',
        value: '~=',
      },
    ]);
  });

  it('should tokenize an expression with names', () => {
    const tokens = new Lexer('a+b=3*2').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'a',
      },
      {
        type: 'PLUS',
        value: '+',
      },
      {
        type: 'NAME',
        value: 'b',
      },
      {
        type: 'EQUAL',
        value: '=',
      },
      {
        type: 'NAME',
        value: '3',
      },
      {
        type: 'TIMES',
        value: '*',
      },
      {
        type: 'NAME',
        value: '2',
      },
    ]);
  });

  it('should handle whitespace', () => {
    const tokens = new Lexer('a +\tb=3*2').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'a',
      },
      {
        type: 'PLUS',
        value: '+',
      },
      {
        type: 'NAME',
        value: 'b',
      },
      {
        type: 'EQUAL',
        value: '=',
      },
      {
        type: 'NAME',
        value: '3',
      },
      {
        type: 'TIMES',
        value: '*',
      },
      {
        type: 'NAME',
        value: '2',
      },
    ]);
  });

  it('should merge whitespace', () => {
    const tokens = new Lexer('a b 2').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'a b 2',
      },
    ]);
  });

  it('should ignore whitespace not inbetween names', () => {
    const tokens = new Lexer('a b 2 + 3').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'a b 2',
      },
      {
        type: 'PLUS',
        value: '+',
      },
      {
        type: 'NAME',
        value: '3',
      },
    ]);
  });

  it('should not keep whitespace at the end of file', () => {
    const tokens = new Lexer('a b 2 \t').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'a b 2',
      },
    ]);
  });

  it('should recognize keywords as non-name tokens', () => {
    const tokens = new Lexer('int sum of to').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'INTEGRAL',
        value: 'int',
      },
      {
        type: 'SUM',
        value: 'sum',
      },
      {
        type: 'OF',
        value: 'of',
      },
      {
        type: 'TO',
        value: 'to',
      },
    ]);
  });

  it('should recognize mixed keyword / name expressions', () => {
    const tokens = new Lexer('int 0 to 1 of some x').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'INTEGRAL',
        value: 'int',
      },
      {
        type: 'NAME',
        value: '0',
      },
      {
        type: 'TO',
        value: 'to',
      },
      {
        type: 'NAME',
        value: '1',
      },
      {
        type: 'OF',
        value: 'of',
      },
      {
        type: 'NAME',
        value: 'some x',
      },
    ]);
  });

  it('should be fine with keywords in names', () => {
    const tokens = new Lexer('hisum').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'NAME',
        value: 'hisum',
      },
    ]);
  });

  it('should handle subtokens built out of smaller tokens', () => {
    const tokens = new Lexer('*****').lex();
    tokens.should.be.a('array');
    tokens.should.eql([
      {
        type: 'LP_TIMES',
        value: '**',
      },
      {
        type: 'LP_TIMES',
        value: '**',
      },
      {
        type: 'TIMES',
        value: '*',
      },
    ]);
  });
});
