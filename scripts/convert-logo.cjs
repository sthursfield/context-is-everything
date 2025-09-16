const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSvgToPng() {
  console.log('🎨 Converting SVG logo to transparent PNG...');

  const svgPath = path.join(__dirname, '../public/assets/CIE_stacked.svg');
  const pngPath = path.join(__dirname, '../public/assets/CIE_stacked_transparent.png');

  try {
    // Read the SVG
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert to PNG with transparency, proper size for web use
    await sharp(svgBuffer)
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        force: true
      })
      .resize({
        width: 490, // 2x the SVG width for crisp display
        height: 184, // 2x the SVG height
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .toFile(pngPath);

    console.log('✅ Logo converted successfully!');
    console.log(`📍 Saved to: ${pngPath}`);
    console.log('📐 Dimensions: 490x184px with transparent background');

    // Get file size
    const stats = fs.statSync(pngPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);

  } catch (error) {
    console.error('❌ Error converting logo:', error);
  }
}

convertSvgToPng();