const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');
const os = require('os');
const unzipper = require('unzipper');

const VERSION = '0.17dev2';
const BASE_URL = `https://github.com/proofrock/ws4sqlite/releases/download/ws4sql_v${VERSION}`;
const EXECUTABLE_NAME = process.platform === 'win32' ? 'ws4sql.exe' : 'ws4sql';
const EXECUTABLE_PATH = path.join(__dirname, EXECUTABLE_NAME);

function getPlatform() {
  switch (process.platform) {
    case 'darwin': return 'darwin';
    case 'win32': return 'windows';
    case 'linux': return 'linux';
    default: throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function getArch() {
  switch (process.arch) {
    case 'x64': return 'amd64';
    case 'arm64': return 'arm64';
    default: throw new Error(`Unsupported architecture: ${process.arch}`);
  }
}

function getDownloadUrl() {
  const platform = getPlatform();
  const arch = getArch();
  return `${BASE_URL}/ws4sql-v${VERSION}-${platform}-${arch}.zip`;
}

function downloadAndExtractExecutable(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302) {
        downloadAndExtractExecutable(response.headers.location).then(resolve).catch(reject);
        return;
      }

      response.pipe(unzipper.Parse())
        .on('entry', (entry) => {
          const fileName = path.basename(entry.path);
          if (fileName === EXECUTABLE_NAME) {
            entry.pipe(fs.createWriteStream(EXECUTABLE_PATH))
              .on('finish', () => {
                fs.chmodSync(EXECUTABLE_PATH, '755');
                resolve();
              });
          } else {
            entry.autodrain();
          }
        })
        .on('error', reject);
    }).on('error', reject);
  });
}

async function ensureExecutable() {
  if (!fs.existsSync(EXECUTABLE_PATH)) {
    console.log('Downloading and extracting ws4sql executable...');
    const url = getDownloadUrl();
    await downloadAndExtractExecutable(url);
    console.log('ws4sql executable downloaded and extracted successfully.');
  }
}

function runWs4sql(args) {
  return new Promise((resolve, reject) => {
    ensureExecutable().then(() => {
      const process = spawn(EXECUTABLE_PATH, args);

      process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ws4sql exited with code ${code}`));
        }
      });
    }).catch(reject);
  });
}

module.exports = {
  runWs4sql,
  executablePath: EXECUTABLE_PATH
};
