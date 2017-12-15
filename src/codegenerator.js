'use strict';

const symbolMap = {
  PLUS: '+',
  MINUS: '-',
  TIMES: '\\cdot',
  LP_TIMES: '\\cdot',
  EQUAL: '=',
  GEQ: '\\geq',
  LEQ: '\\leq',
  NEQ: '\\neq',
  APPROX: '\\approx',
  INTEGRAL: '\\int',
  SUM: '\\sum',
  PRODUCTION: '\\prod',
};

// Currently, there are no simple postfix mappings.
// Keep this here in case some are added.
const postfixMap = {};

/**
 * Generates a LaTeX expression from the given abstract syntax tree.
 * @param {Expression} node - The abstract syntax tree to generate code from.
 * @return {String} The resulting LaTeX code.
 */
const generate = (node) => {
  if (node.type === 'RAW') {
    return node.value;
  }

  if (node.type === 'PREFIX' && node.operator === 'ESCAPE') {
    return `\\${generate(node.value)}`;
  }

  // handle subscript and superscript binary
  if (node.type === 'BINARY' && node.operator === 'SUB') {
    return `${generate(node.left)}_{${generate(node.right)}}`;
  }
  if (node.type === 'BINARY' && node.operator === 'SUPER') {
    return `${generate(node.left)}^{${generate(node.right)}}`;
  }

  // handle fractions
  if (node.type === 'BINARY' && node.operator === 'DIVIDE') {
    const left = generate(node.left);
    const right = generate(node.right);
    return `\\frac{${left}}{${right}}`;
  }

  // handle hats and hoods
  if (node.type === 'POSTFIX' && node.operator === 'AT') {
    return `\\hat{${generate(node.value)}}`;
  }
  if (node.type === 'POSTFIX' && node.operator === 'MESH') {
    return `\\vec{${generate(node.value)}}`;
  }

  // handle subscript and superscript unary
  if (node.type === 'PREFIX' && node.operator === 'SUB') {
    return `_{${generate(node.value)}}`;
  }
  if (node.type === 'PREFIX' && node.operator === 'SUPER') {
    return `^{${generate(node.value)}}`;
  }

  // handle bounded operations (integrals, sums, productions)
  if (node.type === 'BOUNDED') {
    const symbol = symbolMap[node.operator];

    // handle the case with no bounds
    if (node.bounds.length <= 0) {
      return `${symbol} ${generate(node.value)}`;
    }

    // generate the LaTeX for each bound and concatenate them all together
    const stringBounds = node.bounds.map((bound) => {
      if (bound.type === 'BINARY' && bound.operator === 'TO') {
        const low = generate(bound.left);
        const high = generate(bound.right);
        return `${symbol}_{${low}}^{${high}}`;
      }
      return `${symbol}^{${generate(bound)}}`;
    });
    return `${stringBounds.join(' ')} ${generate(node.value)}`;
  }

  // handle the simple case for prefix, postfix, and binary operators
  if (node.type === 'PREFIX') {
    return `${symbolMap[node.operator]}${generate(node.value)}`;
  }
  if (node.type === 'POSTFIX') {
    return `${generate(node.value)}${postfixMap[node.operator]}`;
  }
  if (node.type === 'BINARY') {
    return `${generate(node.left)} ${symbolMap[node.operator]} ${generate(node.right)}`;
  }

  throw new Error(`Invalid node type found in parse tree: ${node}`);
};

module.exports = {
  generate,
};
