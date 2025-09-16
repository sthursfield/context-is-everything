const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function cropLogo() {
  console.log('✂️  Cropping logo PNG to remove excess whitespace...');

  const inputPath = path.join(__dirname, '../public/assets/CIE_stacked_clean.png');
  const outputPath = path.join(__dirname, '../public/assets/CIE_stacked_cropped.png');

  try {
    // Get image metadata first
    const metadata = await sharp(inputPath).metadata();
    console.log(`📐 Original dimensions: ${metadata.width}x${metadata.height}px`);

    // Trim whitespace and crop tightly around content
    await sharp(inputPath)
      .trim({
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // Trim transparent pixels
        threshold: 1 // Very sensitive trimming
      })
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true
      })
      .toFile(outputPath);

    // Get new dimensions
    const newMetadata = await sharp(outputPath).metadata();
    console.log(`✅ Logo cropped successfully!`);
    console.log(`📍 Saved to: ${outputPath}`);
    console.log(`📐 New dimensions: ${newMetadata.width}x${newMetadata.height}px`);
    console.log(`🎯 Removed whitespace for perfect centering`);

    // Get file size
    const stats = fs.statSync(outputPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);

  } catch (error) {
    console.error('❌ Error cropping logo:', error);
  }
}

cropLogo();