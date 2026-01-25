import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

async function optimizeIcon(inputPath, outputPath, options = {}) {
  const { resize, quality = 80 } = options;
  const filename = path.basename(inputPath);

  const before = fs.statSync(inputPath).size;

  let pipeline = sharp(inputPath);

  if (resize) {
    pipeline = pipeline.resize(resize, resize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  await pipeline
    .png({
      compressionLevel: 9,
      palette: true,
      quality,
      effort: 10,
    })
    .toFile(outputPath + '.tmp');

  fs.renameSync(outputPath + '.tmp', outputPath);

  const after = fs.statSync(outputPath).size;
  const savings = Math.round((1 - after / before) * 100);

  console.log(
    `${filename}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB (${savings}% smaller)`
  );
}

async function optimizeAllIcons() {
  console.log('Optimizing icons...\n');

  // Resize favicon to 180x180 (apple-touch-icon size)
  await optimizeIcon(
    path.join(publicDir, 'favicon.png'),
    path.join(publicDir, 'favicon.png'),
    { resize: 180 }
  );

  // Optimize icon-192
  await optimizeIcon(
    path.join(publicDir, 'icon-192.png'),
    path.join(publicDir, 'icon-192.png')
  );

  // Optimize icon-192-maskable
  await optimizeIcon(
    path.join(publicDir, 'icon-192-maskable.png'),
    path.join(publicDir, 'icon-192-maskable.png')
  );

  // Optimize icon-512
  await optimizeIcon(
    path.join(publicDir, 'icon-512.png'),
    path.join(publicDir, 'icon-512.png')
  );

  // Optimize icon-512-maskable
  await optimizeIcon(
    path.join(publicDir, 'icon-512-maskable.png'),
    path.join(publicDir, 'icon-512-maskable.png')
  );

  // Optimize logo.png (keep 1024 but compress)
  await optimizeIcon(
    path.join(publicDir, 'logo.png'),
    path.join(publicDir, 'logo.png')
  );

  console.log('\nDone!');
}

optimizeAllIcons().catch(console.error);
