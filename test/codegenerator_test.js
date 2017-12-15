'use strict';

/* global describe it */

const chai = require('chai');

const { generate } = require('../src/codegenerator.js');

chai.should();

const raw = (value) => {
  return {
    type: 'RAW',
    value,
  };
};

describe('Code Generator', () => {
  describe('generate()', () => {
    it('should generate code for basic expressions', () => {
      const latex = generate(raw('hello world'));
      latex.should.not.be.null;
      latex.should.equal('hello world');
    });

    it('should generate code for basic arithmetic', () => {
      const ast = {
        type: 'BINARY',
        operator: 'PLUS',
        left: raw('a'),
        right: raw('b'),
      };

      const latex = generate(ast);
      latex.should.not.be.null;
      latex.should.equal('a + b');
    });

    it('should generate code for LaTeX escapes', () => {
      const ast = {
        type: 'PREFIX',
        operator: 'ESCAPE',
        value: raw('pi'),
      };

      const latex = generate(ast);
      latex.should.not.be.null;
      latex.should.equal('\\pi');
    });

    it('should generate code for integrals', () => {
      const ast = {
        type: 'BOUNDED',
        operator: 'INTEGRAL',
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
      };

      const latex = generate(ast);
      latex.should.not.be.null;
      latex.should.equal('\\int_{0}^{\\pi} \\int^{infinity} x');
    });

    it('should generate code for integrals without bounds', () => {
      const ast = {
        type: 'BOUNDED',
        operator: 'INTEGRAL',
        bounds: [],
        value: raw('x'),
      };

      const latex = generate(ast);
      latex.should.not.be.null;
      latex.should.equal('\\int x');
    });
  });
});
