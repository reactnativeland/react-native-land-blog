import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

async function processIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const inputPath = path.join(publicDir, `icon-${size}.png`);
    const outputPath = path.join(publicDir, `icon-${size}.png`);
    const maskablePath = path.join(publicDir, `icon-${size}-maskable.png`);

    console.log(`Processing icon-${size}.png...`);

    // Read the original icon
    const original = sharp(inputPath);
    const metadata = await original.metadata();

    // 1. Add alpha channel to original icon (convert to RGBA)
    await sharp(inputPath)
      .ensureAlpha()
      .png()
      .toFile(outputPath + '.tmp');

    // Replace original with alpha version
    const fs = await import('fs');
    fs.renameSync(outputPath + '.tmp', outputPath);
    console.log(`  - Added alpha channel to icon-${size}.png`);

    // 2. Create maskable version with safe zone padding
    // Maskable icons need content in the center 80% (safe zone)
    // We'll add 10% padding on each side
    const padding = Math.round(size * 0.1);
    const innerSize = size - padding * 2;

    await sharp(inputPath)
      .ensureAlpha()
      .resize(innerSize, innerSize, { fit: 'contain' })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .png()
      .toFile(maskablePath);

    console.log(`  - Created icon-${size}-maskable.png`);
  }

  // Also process logo.png
  const logoPath = path.join(publicDir, 'logo.png');
  console.log('Processing logo.png...');

  await sharp(logoPath)
    .ensureAlpha()
    .png()
    .toFile(logoPath + '.tmp');

  const fs = await import('fs');
  fs.renameSync(logoPath + '.tmp', logoPath);
  console.log('  - Added alpha channel to logo.png');

  console.log('\nDone! Icons have been processed.');
}

processIcons().catch(console.error);
