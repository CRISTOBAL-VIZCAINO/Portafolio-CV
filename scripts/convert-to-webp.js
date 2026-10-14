/**
 * Convierte las imágenes PNG/JPG de public/images/ (incluidas sus subcarpetas) a WebP (máx. 1600 px de ancho).
 *
 * Uso:   npm run images
 * Notas: no borra los originales ni sobrescribe WebP existentes (usa --force para regenerarlos).
 *        Después de convertir, usa el .webp en src/app/data/ y guarda el original fuera del repo
 *        (por ejemplo en docs/fuentes-locales/, que está en .gitignore).
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_WIDTH = 1600; // los contenedores del sitio miden como máximo ~1150 px; 1600 cubre pantallas 1.4x
const QUALITY = 80;
const FORCE = process.argv.includes('--force');

const kb = (bytes) => (bytes / 1024).toFixed(0).padStart(6);
// "-85%" si el WebP pesa menos; "+12%" si pesa más (pasa con imágenes planas: conviene conservar el original).
const change = (before, after) => `${after <= before ? '-' : '+'}${Math.abs((1 - after / before) * 100).toFixed(0)}%`;

async function convertImages() {
  const imageFiles = fs
    .readdirSync(IMAGES_DIR, { recursive: true })
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort();

  console.log(`Imágenes a convertir: ${imageFiles.length}\n`);

  let totalOriginal = 0;
  let totalWebp = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(IMAGES_DIR, file.replace(/\.(png|jpe?g)$/i, '.webp'));

    if (fs.existsSync(outputPath) && !FORCE) {
      console.log(`  ${file.padEnd(24)} ya existe .webp, se omite`);
      continue;
    }

    const originalSize = fs.statSync(inputPath).size;
    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5, smartSubsample: true })
        .toFile(outputPath);

      const webpSize = fs.statSync(outputPath).size;
      totalOriginal += originalSize;
      totalWebp += webpSize;
      console.log(
        `  ${file.padEnd(24)} ${kb(originalSize)} KB -> ${kb(webpSize)} KB  (${change(originalSize, webpSize)})`
      );
    } catch (err) {
      console.error(`  ERROR convirtiendo ${file}:`, err.message);
    }
  }

  if (totalOriginal > 0) {
    console.log('\n--- TOTAL ---');
    console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP:     ${(totalWebp / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Cambio:   ${change(totalOriginal, totalWebp)}`);
  }
}

convertImages().catch(console.error);
