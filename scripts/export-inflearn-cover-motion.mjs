import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WIDTH = 1200;
const HEIGHT = 781;
const FPS = 30;
const DURATION_SECONDS = 3;
const FRAME_COUNT = FPS * DURATION_SECONDS;
const EXPORT_HEIGHT = 780;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const htmlPath = path.join(repoRoot, "docs", "inflearn-cover-motion.html");
const framesDir = path.join(tmpdir(), "codex-cover-motion-frames");
const chromeProfileDir = path.join(tmpdir(), "codex-cover-motion-chrome-profile");
const outputPath = path.join(repoRoot, "public", "inflearn", "codex-cover-motion.mp4");

const chromePath = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ffmpegPath = process.env.FFMPEG_PATH || "/opt/homebrew/bin/ffmpeg";

function assertExists(filePath, label) {
  if (!existsSync(filePath)) {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    });
    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new Error(`${command} exited with ${code}\n${stderr || stdout}`));
    });
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome(port) {
  const endpoint = `http://127.0.0.1:${port}/json/version`;
  const deadline = Date.now() + 10000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }

  throw new Error("Timed out waiting for Chrome DevTools endpoint.");
}

async function createPageTarget(port) {
  const url = `http://127.0.0.1:${port}/json/new?about:blank`;
  let response = await fetch(url, { method: "PUT" });
  if (!response.ok) {
    response = await fetch(url);
  }
  if (!response.ok) {
    throw new Error(`Failed to create Chrome target: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

function connectCdp(webSocketDebuggerUrl) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const pending = new Map();
    let nextId = 1;

    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((resolveCommand, rejectCommand) => {
            pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
          });
        },
        close() {
          socket.close();
        },
      });
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;

      const { resolve: resolveCommand, reject: rejectCommand } = pending.get(message.id);
      pending.delete(message.id);

      if (message.error) {
        rejectCommand(new Error(`${message.error.message}\n${message.error.data || ""}`));
        return;
      }
      resolveCommand(message.result);
    });

    socket.addEventListener("error", reject);
  });
}

async function prepareChrome() {
  const port = 9300 + Math.floor(Math.random() * 1000);
  await rm(chromeProfileDir, { recursive: true, force: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${chromeProfileDir}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    "--force-device-scale-factor=1",
    "--hide-scrollbars",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-gpu",
    "--disable-sync",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "about:blank",
  ], {
    stdio: ["ignore", "ignore", "pipe"],
  });

  let chromeStderr = "";
  chrome.stderr?.on("data", (chunk) => {
    chromeStderr += chunk;
  });

  chrome.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(chromeStderr);
    }
  });

  await waitForChrome(port);
  const target = await createPageTarget(port);
  const cdp = await connectCdp(target.webSocketDebuggerUrl);
  return { chrome, cdp };
}

async function captureFrames(cdp) {
  const sourceUrl = `${pathToFileURL(htmlPath).href}?export=1&t=0`;

  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: WIDTH,
    screenHeight: HEIGHT,
  });
  await cdp.send("Page.navigate", { url: sourceUrl });

  await delay(500);
  await cdp.send("Runtime.evaluate", {
    expression: "document.fonts ? document.fonts.ready : Promise.resolve()",
    awaitPromise: true,
  });

  for (let frame = 0; frame < FRAME_COUNT; frame += 1) {
    const timeMs = frame * (1000 / FPS);
    const framePath = path.join(framesDir, `frame_${String(frame).padStart(4, "0")}.png`);

    await cdp.send("Runtime.evaluate", {
      expression: `
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            window.__setExportTime(${timeMs});
            requestAnimationFrame(() => resolve(document.documentElement.dataset.exportTime));
          });
        })
      `,
      awaitPromise: true,
    });

    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
      clip: {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT,
        scale: 1,
      },
    });

    await writeFile(framePath, Buffer.from(screenshot.data, "base64"));
    process.stdout.write(`\rCaptured frame ${String(frame + 1).padStart(2, "0")}/${FRAME_COUNT}`);
  }
  process.stdout.write("\n");
}

async function encodeVideo() {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await run(ffmpegPath, [
    "-y",
    "-framerate",
    String(FPS),
    "-i",
    path.join(framesDir, "frame_%04d.png"),
    "-vf",
    `crop=${WIDTH}:${EXPORT_HEIGHT}:0:0,format=yuv420p`,
    "-c:v",
    "libx264",
    "-crf",
    "18",
    "-preset",
    "slow",
    "-movflags",
    "+faststart",
    outputPath,
  ]);
}

async function main() {
  assertExists(htmlPath, "Motion cover HTML");
  assertExists(chromePath, "Google Chrome");
  assertExists(ffmpegPath, "ffmpeg");

  await rm(framesDir, { recursive: true, force: true });
  await mkdir(framesDir, { recursive: true });

  const { chrome, cdp } = await prepareChrome();
  try {
    await captureFrames(cdp);
    await encodeVideo();
  } finally {
    cdp.close();
    chrome.kill("SIGTERM");
    await rm(chromeProfileDir, { recursive: true, force: true });
  }

  console.log(`Exported ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
