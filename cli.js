#!/usr/bin/env node

import { runWs4sql } from "./index.js";

const args = process.argv.slice(2);

runWs4sql(args)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
