import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const session = "inflearn-frame-export";
const fps = 30;
const durationSeconds = 3;
const totalFrames = fps * durationSeconds;
const viewport = { width: 1200, height: 781 };

const htmlPath = path.join(repoRoot, "docs", "inflearn-cover-motion.html");
const frameDir = "/private/tmp/codex-cover-motion-frames";
const outputPath = path.join(
  repoRoot,
  "public",
  "inflearn",
  "codex-cover-motion-frame-seq.webm",
);

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: repoRoot,
    stdio: options.stdio ?? "pipe",
    encoding: options.encoding ?? "utf8",
  });
}

function agent(args, options) {
  return run("agent-browser", ["--session", session, ...args], options);
}

function log(message) {
  process.stdout.write(`${message}\n`);
}

fs.rmSync(frameDir, { recursive: true, force: true });
fs.mkdirSync(frameDir, { recursive: true });
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const sourceUrl = `${pathToFileURL(htmlPath).href}?export=1&t=0`;

try {
  log("Opening export page...");
  agent(["set", "viewport", String(viewport.width), String(viewport.height)]);
  agent(["open", sourceUrl]);
  agent(["wait", "500"]);

  log(`Capturing ${totalFrames} frames at ${fps}fps...`);
  for (let frame = 0; frame < totalFrames; frame += 1) {
    const timeMs = (frame / fps) * 1000;
    const script = `
      (() => new Promise((resolve) => {
        window.__setExportTime(${timeMs.toFixed(4)});
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve(document.documentElement.dataset.exportTime));
        });
      }))()
    `;
    agent(["eval", script]);

    const framePath = path.join(frameDir, `frame_${String(frame).padStart(4, "0")}.png`);
    agent(["screenshot", framePath]);

    if ((frame + 1) % 10 === 0 || frame + 1 === totalFrames) {
      log(`  ${frame + 1}/${totalFrames}`);
    }
  }

  log("Encoding WebM...");
  run(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(frameDir, "frame_%04d.png"),
      "-vf",
      "crop=1200:780:0:0,format=yuv420p",
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "24",
      "-b:v",
      "0",
      "-row-mt",
      "1",
      outputPath,
    ],
    { stdio: "inherit", encoding: "buffer" },
  );

  log(`Done: ${outputPath}`);
} finally {
  try {
    agent(["close"]);
  } catch {
    // Browser may already be closed; nothing to clean up.
  }
}
