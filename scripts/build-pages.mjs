import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const minesweeperSubsite = join(dist, "games", "minesweeper");
const minesweeperFiles = [
  "minesweeper.html",
  "style.css",
  "script.js",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png"
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
mkdirSync(minesweeperSubsite, { recursive: true });

copyFileSync(join(root, "index.html"), join(dist, "index.html"));
copyFileSync(join(root, "mall.css"), join(dist, "mall.css"));
copyFileSync(join(root, "mall.js"), join(dist, "mall.js"));
copyFileSync(join(root, "icon.svg"), join(dist, "icon.svg"));
copyFileSync(join(root, "root-sw-cleanup.js"), join(dist, "sw.js"));

if (existsSync(join(root, "static"))) {
  copyDirectory(join(root, "static"), join(dist, "static"));
}

for (const file of minesweeperFiles) {
  copyFileSync(join(root, file), join(minesweeperSubsite, file));
}

copyFileSync(join(root, "src", "worker.js"), join(dist, "_worker.js"));

function copyDirectory(source, target) {
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const targetPath = join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }
    if (entry.isFile() || statSync(sourcePath).isFile()) {
      copyFileSync(sourcePath, targetPath);
    }
  }
}
