#!/usr/bin/env node

const { runWs4sql } = require('./index');

const args = process.argv.slice(2);

runWs4sql(args)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
