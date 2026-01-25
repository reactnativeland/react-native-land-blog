import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

async function makeBackgroundTransparent(inputPath, outputPath) {
  console.log(`Processing ${path.basename(inputPath)}...`);

  // Read the image and get raw pixel data
  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // Get the background color from the corner pixel (top-left)
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  console.log(`  - Detected background color: rgb(${bgR}, ${bgG}, ${bgB})`);

  // Create new buffer with transparent background
  const newData = Buffer.alloc(data.length);
  const tolerance = 30; // Color tolerance for background detection

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Check if pixel matches background color (within tolerance)
    const isBackground =
      Math.abs(r - bgR) <= tolerance &&
      Math.abs(g - bgG) <= tolerance &&
      Math.abs(b - bgB) <= tolerance;

    if (isBackground) {
      // Make transparent
      newData[i] = 0;
      newData[i + 1] = 0;
      newData[i + 2] = 0;
      newData[i + 3] = 0;
    } else {
      // Keep original
      newData[i] = r;
      newData[i + 1] = g;
      newData[i + 2] = b;
      newData[i + 3] = a;
    }
  }

  // Save with transparent background
  await sharp(newData, {
    raw: { width, height, channels },
  })
    .png()
    .toFile(outputPath + '.tmp');

  fs.renameSync(outputPath + '.tmp', outputPath);
  console.log(`  - Saved with transparent background`);
}

async function processAllIcons() {
  // Process all icon sizes
  const iconSizes = [192, 512];
  for (const size of iconSizes) {
    const iconPath = path.join(publicDir, `icon-${size}.png`);
    await makeBackgroundTransparent(iconPath, iconPath);
  }

  // Process maskable icons too
  for (const size of iconSizes) {
    const maskablePath = path.join(publicDir, `icon-${size}-maskable.png`);
    await makeBackgroundTransparent(maskablePath, maskablePath);
  }

  // Process logo.png
  const logoPath = path.join(publicDir, 'logo.png');
  await makeBackgroundTransparent(logoPath, logoPath);

  // Process favicon.png
  const faviconPath = path.join(publicDir, 'favicon.png');
  await makeBackgroundTransparent(faviconPath, faviconPath);

  console.log('\nDone! All icons now have transparent backgrounds.');
}

processAllIcons().catch(console.error);
