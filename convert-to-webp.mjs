import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const itemsDir = './public/items';

async function convertToWebP() {
    const files = fs.readdirSync(itemsDir);
    const pngFiles = files.filter(f => f.endsWith('.png'));

    console.log(`Found ${pngFiles.length} PNG files to convert`);

    for (const file of pngFiles) {
        const inputPath = path.join(itemsDir, file);
        const outputPath = path.join(itemsDir, file.replace('.png', '.webp'));

        try {
            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPath);

            fs.unlinkSync(inputPath);
            console.log(`✓ Converted: ${file} -> ${file.replace('.png', '.webp')}`);
        } catch (err) {
            console.error(`✗ Error converting ${file}:`, err.message);
        }
    }

    console.log('Done!');
}

convertToWebP();
