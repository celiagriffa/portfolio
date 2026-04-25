import sharp from 'sharp';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';

const IMAGES_DIR = './src/data/images';
const THUMBS_DIR = './src/data/images/thumbs';
const THUMB_WIDTH = 400; // larghezza in px delle thumbnails

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp'];

// Prende tutte le cartelle dentro /images (esclusa /thumbs)
const folders = readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'thumbs')
    .map((d) => d.name);

for (const folder of folders) {
    const srcFolder = join(IMAGES_DIR, folder);
    const destFolder = join(THUMBS_DIR, folder);

    if (!existsSync(destFolder)) {
        mkdirSync(destFolder, { recursive: true });
    }

    const files = readdirSync(srcFolder).filter((f) =>
        SUPPORTED.includes(extname(f).toLowerCase())
    );

    console.log(`\n📁 ${folder} — ${files.length} immagini`);

    for (const file of files) {
        const srcPath = join(srcFolder, file);
        const destPath = join(destFolder, file);

        if (existsSync(destPath)) {
            console.log(`  ⏭  ${file} (già esistente, skip)`);
            continue;
        }

        try {
            await sharp(srcPath)
                .resize({ width: THUMB_WIDTH })
                .toFile(destPath);
            console.log(`  ✅ ${file}`);
        } catch (err) {
            console.error(`  ❌ ${file} — ${err.message}`);
        }
    }
}

console.log('\n✨ Thumbnails generate!');
