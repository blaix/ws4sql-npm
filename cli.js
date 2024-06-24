#!/usr/bin/env node

import { runWs4sql } from './index.js';

const args = process.argv.slice(2);

runWs4sql(args)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
