import { cpSync, rmSync, existsSync } from 'node:fs';

const src = 'build';
const dest = 'release/build';
console.log("test")

if (!existsSync(src)) {
  console.error(`"${src}" not found, nothing to move.`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });
rmSync(src, { recursive: true, force: true }); // remove this line to copy instead of move
console.log(`Moved ${src} -> ${dest}`);