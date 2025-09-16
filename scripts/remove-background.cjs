const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function removeWhiteBackground() {
  console.log('🎨 Removing white background from original PNG...');

  const inputPath = path.join(__dirname, '../public/assets/CIE_stacked.png');
  const outputPath = path.join(__dirname, '../public/assets/CIE_stacked_clean.png');

  try {
    // Remove white background and make it transparent
    await sharp(inputPath)
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true
      })
      .flatten({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      // Remove white pixels (make them transparent)
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Process pixel data to make white pixels transparent
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // If pixel is white or very light, make it transparent
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }

        return sharp(data, {
          raw: {
            width: info.width,
            height: info.height,
            channels: 4
          }
        })
        .png()
        .toFile(outputPath);
      });

    console.log('✅ Background removed successfully!');
    console.log(`📍 Saved to: ${outputPath}`);

    // Get file size
    const stats = fs.statSync(outputPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);

  } catch (error) {
    console.error('❌ Error removing background:', error);
  }
}

removeWhiteBackground();