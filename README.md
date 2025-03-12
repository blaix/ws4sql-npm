# ws4sql npm package

Install and use [ws4sql(ite)](https://github.com/proofrock/ws4sqlite) via npm.

## Installation and Usage

Globally (may require admin/sudo):

```
npm install -g ws4sql
ws4sql --help
```

Locally:

```
npm install ws4sql
npx ws4sql --help
```

Try out or use directly with [npx](https://docs.npmjs.com/cli/v8/commands/npx):

```
npx ws4sql --quick-db test.db
```

Or from your own javascript:

```js
import { runWs4sql } from 'ws4sql';

const args = process.argv.slice(2);
runWs4sql(args)
  .then(() => console.log('ws4sql command executed successfully'))
  .catch(error => console.error('Error executing ws4sql:', error));
```
