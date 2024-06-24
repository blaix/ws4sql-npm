# ws4sqlite

Wrapper to install and use [ws4sqlite](https://github.com/proofrock/ws4sqlite) with npm.

## Install

```
npm install -g ws4sql
```

## Usage

From the command line:

```
ws4sql --help
```

From your own javascript:

```js
const { runWs4sql } = require('ws4sql');

runWs4sql(['--help'])
  .then(() => console.log('ws4sql command executed successfully'))
  .catch(error => console.error('Error executing ws4sql:', error));
```
