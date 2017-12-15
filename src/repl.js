'use strict';

const { compile } = require('./compiler');
const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

process.stdout.write('> ');

rl.on('line', (line) => {
  const result = compile(line);
  console.log(result);
  process.stdout.write('> ');
});
