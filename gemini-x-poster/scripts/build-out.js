#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const outDir = path.join(rootDir, 'out');

function ensureInsideRoot(targetPath) {
  const relativePath = path.relative(rootDir, targetPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`Refusing to write outside project root: ${targetPath}`);
  }
}

function copyDirectory(sourceDir, targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function buildOut() {
  if (!fs.existsSync(publicDir)) {
    throw new Error('public directory does not exist.');
  }

  ensureInsideRoot(outDir);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  copyDirectory(publicDir, outDir);

  return {
    input: path.relative(rootDir, publicDir),
    output: path.relative(rootDir, outDir),
  };
}

if (require.main === module) {
  try {
    const result = buildOut();
    console.log(`Built ${result.output} from ${result.input}`);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  }
}

module.exports = {
  buildOut,
};
