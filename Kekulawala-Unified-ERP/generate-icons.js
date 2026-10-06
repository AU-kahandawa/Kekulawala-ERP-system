import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = join(__dirname, 'public', 'icons');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// Minimal valid 1x1 transparent PNG
const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

SIZES.forEach(size => {
  const outPath = join(outDir, `icon-${size}x${size}.png`);
  if (!existsSync(outPath)) {
    writeFileSync(outPath, tinyPng);
    console.log(`📝 Created placeholder: icon-${size}x${size}.png`);
  } else {
    console.log(`✔  Exists: icon-${size}x${size}.png`);
  }
});

console.log('\n✅ icons/ directory ready. For real icons, install sharp:');
console.log('   npm install --save-dev sharp');
