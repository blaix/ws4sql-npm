# ws4sql npm package

Install and use [ws4sql(ite)](https://github.com/proofrock/ws4sqlite) via npm.

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
import { runWs4sql } from 'ws4sql';

runWs4sql(['--help'])
  .then(() => console.log('ws4sql command executed successfully'))
  .catch(error => console.error('Error executing ws4sql:', error));
```
