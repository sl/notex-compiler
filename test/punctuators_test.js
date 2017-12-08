'use strict';

/* global describe it */

const chai = require('chai');
const { getPunctuator } = require('../src/punctuators');

chai.should();

describe('punctuators', () => {
  describe('#getPunctuator()', () => {
    it('should recognize single charater punctuators', () => {
      const punc = getPunctuator('+');
      punc.should.not.be.null;
      punc.should.have.own.property('type');
      punc.should.have.own.property('value');
      const { type, value } = punc;
      type.should.equal('PLUS');
      value.should.equal('+');
    });

    it('should recognize single charater punctuators with trailing characters', () => {
      const punc = getPunctuator('+ 23 ** 1231 arcohuoauh');
      punc.should.not.be.null;
      punc.should.have.own.property('type');
      punc.should.have.own.property('value');
      const { type, value } = punc;
      type.should.equal('PLUS');
      value.should.equal('+');
    });

    it('should recognize multi charater punctuators', () => {
      const punc = getPunctuator('**');
      punc.should.not.be.null;
      punc.should.have.own.property('type');
      punc.should.have.own.property('value');
      const { type, value } = punc;
      type.should.equal('LP_TIMES');
      value.should.equal('**');
    });

    it('should recognize multi charater punctuators with trailing characters', () => {
      const punc = getPunctuator('** 23 + 1231 arcohuoauh');
      punc.should.not.be.null;
      punc.should.have.own.property('type');
      punc.should.have.own.property('value');
      const { type, value } = punc;
      type.should.equal('LP_TIMES');
      value.should.equal('**');
    });
  });
});
