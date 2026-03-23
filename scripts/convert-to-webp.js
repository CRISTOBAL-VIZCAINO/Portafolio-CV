const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const QUALITY = 80;

async function convertImages() {
  const files = fs.readdirSync(PUBLIC_DIR);
  const imageFiles = files.filter(f =>
    /\.(png|jpg|jpeg)$/i.test(f)
  );

  console.log(`Found ${imageFiles.length} images to convert:\n`);

  let totalOriginal = 0;
  let totalWebp = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(PUBLIC_DIR, outputName);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    try {
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const webpSize = fs.statSync(outputPath).size;
      totalWebp += webpSize;

      const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
      console.log(
        `  ${file.padEnd(25)} ${(originalSize / 1024).toFixed(0).padStart(6)} KB -> ${(webpSize / 1024).toFixed(0).padStart(6)} KB  (${savings}% smaller)`
      );
    } catch (err) {
      console.error(`  ERROR converting ${file}:`, err.message);
    }
  }

  console.log('\n--- TOTAL ---');
  console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  WebP:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Saved:    ${((totalOriginal - totalWebp) / 1024 / 1024).toFixed(2)} MB (${((1 - totalWebp / totalOriginal) * 100).toFixed(1)}%)`);
}

convertImages().catch(console.error);
