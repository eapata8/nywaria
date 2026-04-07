import { spawn } from "node:child_process";
import path from "node:path";

const rootDir = process.cwd();
const nodeExecutable = process.execPath;
const vitePath = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

const children = [
  spawn(nodeExecutable, ["server/index.mjs"], {
    cwd: rootDir,
    stdio: "inherit",
  }),
  spawn(nodeExecutable, [vitePath], {
    cwd: rootDir,
    stdio: "inherit",
  }),
];

function shutdown(signal = "SIGTERM") {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal);
    }
  }
}

for (const child of children) {
  child.on("exit", (code) => {
    if (code && code !== 0) {
      shutdown();
      process.exit(code);
    }
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
  process.exit(0);
});
