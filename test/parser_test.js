'use strict';

/* global describe it */

const chai = require('chai');
const Parser = require('../src/parser.js');

chai.should();

const raw = (value) => {
  return {
    type: 'RAW',
    value,
  };
};

describe('Parser', () => {
  it('should parse names', () => {
    const parser = new Parser('hello world');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql(raw('hello world'));
  });

  it('should parse basic arithmetic', () => {
    const parser = new Parser('a + b');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'BINARY',
      operator: 'PLUS',
      left: raw('a'),
      right: raw('b'),
    });
  });

  it('should parse recursive expressions', () => {
    const parser = new Parser('(a + c) * b');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'BINARY',
      operator: 'TIMES',
      left: {
        type: 'BINARY',
        operator: 'PLUS',
        left: raw('a'),
        right: raw('c'),
      },
      right: raw('b'),
    });
  });

  it('should understand order of operations', () => {
    const parser = new Parser('a + c * b');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'BINARY',
      operator: 'PLUS',
      left: raw('a'),
      right: {
        type: 'BINARY',
        operator: 'TIMES',
        left: raw('c'),
        right: raw('b'),
      },
    });
  });

  it('should understand equality', () => {
    const parser = new Parser('3 = i + 3');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'BINARY',
      operator: 'EQUAL',
      left: raw('3'),
      right: {
        type: 'BINARY',
        operator: 'PLUS',
        left: raw('i'),
        right: raw('3'),
      },
    });
  });

  it('should understand latek escapes', () => {
    const parser = new Parser('\\pi');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'PREFIX',
      operator: 'ESCAPE',
      value: raw('pi'),
    });
  });

  it('should understand integrals', () => {
    const parser = new Parser('int 0 to \\pi, infinity of x');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'INTEGRAL',
      bounds: [
        {
          type: 'BINARY',
          operator: 'TO',
          left: raw('0'),
          right: {
            type: 'PREFIX',
            operator: 'ESCAPE',
            value: raw('pi'),
          },
        },
        raw('infinity'),
      ],
      value: raw('x'),
    });
  });

  it('should understand sums', () => {
    const parser = new Parser('sum i = 0 to n of i');
    const parseTree = parser.parseExpression();

    parseTree.should.not.be.null;
    parseTree.should.eql({
      type: 'SUM',
      bounds: [
        {
          type: 'BINARY',
          operator: 'TO',
          left: {
            type: 'BINARY',
            operator: 'EQUAL',
            left: raw('i'),
            right: raw('0'),
          },
          right: raw('n'),
        },
      ],
      value: raw('i'),
    });
  });
});
