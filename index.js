import decompress from "decompress";
import fs from "fs";
import https from "https";
import os from "os";
import path from "path";
import envPaths from "env-paths";
import { spawn } from "child_process";

const VERSION = "0.17dev2";
const BASE_URL = `https://github.com/proofrock/ws4sqlite/releases/download/ws4sql_v${VERSION}`;
const EXECUTABLE_NAME = process.platform === "win32" ? "ws4sql.exe" : "ws4sql";

const paths = envPaths("ws4sql");
const CACHE_DIR = paths.cache;
const EXECUTABLE_PATH = path.join(CACHE_DIR, EXECUTABLE_NAME);

function getPlatform() {
  switch (process.platform) {
    case "darwin":
      return "darwin";
    case "win32":
      return "win";
    case "linux":
      return "linux";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function getArch() {
  switch (process.arch) {
    case "x64":
      return "x86_64";
    case "x86":
      return "x86_64";
    case "arm64":
      return "arm64";
    // TODO: test this arch
    case "arm-v6":
      return "arm-v6";
    default:
      throw new Error(`Unsupported architecture: ${process.arch}`);
  }
}

function getExtension() {
  switch (process.platform) {
    case "darwin":
      return "zip";
    case "win32":
      return "zip";
    case "linux":
      return "tar.gz";
    default:
      throw new Error(`Unsupported platform: ${process.platform}`);
  }
}

function getDownloadUrl() {
  const platform = getPlatform();
  const arch = getArch();
  const ext = getExtension();
  return `${BASE_URL}/ws4sql-v${VERSION}-${platform}-${arch}.${ext}`;
}

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function downloadAndExtractExecutable(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302) {
        downloadAndExtractExecutable(response.headers.location)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode == 404) {
	const error = `${url} not found.`;
	console.error(`ERROR: ${error}`);
        reject(new Error(error));
      }

      const data = [];
      response.on("data", (chunk) => {
        data.push(chunk);
      });

      response.on("end", () => {
        const buffer = Buffer.concat(data);
        decompress(buffer, CACHE_DIR).then((files) => {
          fs.chmodSync(EXECUTABLE_PATH, "755");
          resolve();
        });
      });
    });
  });
}

async function ensureExecutable() {
  ensureCacheDir();
  if (!fs.existsSync(EXECUTABLE_PATH)) {
    const url = getDownloadUrl();
    console.log("Executable not found. Downloading", url);
    await downloadAndExtractExecutable(url);
    console.log("Downloaded and extracted successfully.");
  }
}

function runWs4sql(args) {
  return new Promise((resolve, reject) => {
    ensureExecutable()
      .then(() => {
        const process = spawn(EXECUTABLE_PATH, args);

        process.stdout.on("data", (data) => {
          console.log(`${data}`);
        });

        process.stderr.on("data", (data) => {
          console.error(`${data}`);
        });

        process.on("error", (error) => {
          reject(new Error(`${error}`));
        });

        process.on("close", (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject();
          }
        });
      })
      .catch(reject);
  });
}

export { runWs4sql, EXECUTABLE_PATH as executablePath };
