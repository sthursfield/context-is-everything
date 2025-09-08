#!/usr/bin/env node
import { createCanvas } from 'canvas';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import parseSVGPath from 'svg-path-parser';

// Create a heightmap from Flat-top.svg for Three.js displacement mapping
console.log('🏔️  Generating heightmap from Flat-top.svg...');

// File paths
const svgFile = './public/assets/flat-top.svg';
const outputPath = './public/assets/heightmap.png';

try {
  // Read and parse SVG
  const svgContent = fs.readFileSync(svgFile, 'utf8');
  const dom = new JSDOM(svgContent);
  const document = dom.window.document;
  const paths = document.querySelectorAll('path');

  console.log(`📄 Found ${paths.length} paths in SVG`);

  // Canvas setup - using power-of-2 dimensions for better GPU performance
  const width = 1024;
  const height = 1024;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Black background for areas with no displacement (invisible/transparent in material)
  // White pixels create displacement for organic contours only
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Define much fewer elevation levels for clean tree ring appearance
  // Black = no displacement, White = maximum displacement
  const elevationLevels = [
    '#404040', // Outermost ring - low elevation
    '#808080', // Middle ring - medium elevation  
    '#c0c0c0', // Inner ring - high elevation
    '#ffffff'  // Center peak - maximum elevation
  ];

  // Get SVG viewBox to calculate proper scaling
  const svgElement = document.querySelector('svg');
  const viewBox = svgElement?.getAttribute('viewBox');
  let svgWidth = 331.67, svgHeight = 286.69; // From your flat-top.svg
  
  if (viewBox) {
    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
    svgWidth = vbWidth;
    svgHeight = vbHeight;
  }

  console.log(`📐 SVG dimensions: ${svgWidth} x ${svgHeight}`);

  // Calculate scaling to fit SVG in canvas with padding
  const padding = 100;
  const scaleX = (width - padding * 2) / svgWidth;
  const scaleY = (height - padding * 2) / svgHeight;
  const scale = Math.min(scaleX, scaleY);

  // Center the scaled content
  const offsetX = (width - svgWidth * scale) / 2;
  const offsetY = (height - svgHeight * scale) / 2;

  console.log(`🎯 Scale: ${scale.toFixed(3)}, Offset: ${offsetX.toFixed(1)}, ${offsetY.toFixed(1)}`);

  // Filter and sort paths - ONLY extract organic contour paths (cls-1, cls-2 stroke classes)
  // This removes the square canvas/artboard background completely
  const pathArray = Array.from(paths).filter(path => {
    const pathData = path.getAttribute('d');
    const className = path.getAttribute('class') || '';
    const style = path.getAttribute('style') || '';
    const fill = path.getAttribute('fill') || '';
    
    // ONLY include paths with stroke classes (cls-1, cls-2) - these are the organic contours
    // These have fill="none" and stroke="#000" - exactly what we want for tree ring shapes
    if (!className.includes('cls-')) {
      console.log('⚠️  Skipping non-contour path (no cls- class)');
      return false;
    }
    
    // Skip any solid fill backgrounds
    if (fill && fill !== 'none') {
      console.log('⚠️  Skipping filled path (not a stroke contour)');
      return false;
    }
    
    // Must have valid path data
    return pathData && pathData.length > 10;
  });
  
  console.log(`🎯 Filtered to ${pathArray.length} organic contour paths (tree ring shapes)`);
  
  // Sort paths by approximate size - larger paths are outer contours (lower elevation)
  pathArray.sort((a, b) => {
    const aData = a.getAttribute('d') || '';
    const bData = b.getAttribute('d') || '';
    return bData.length - aData.length; // Larger paths first (outer rings)
  });
  
  pathArray.forEach((path, index) => {
    const pathData = path.getAttribute('d');
    if (!pathData) return;

    // Select elevation color based on path index
    const elevationIndex = Math.min(index, elevationLevels.length - 1);
    const elevationColor = elevationLevels[elevationIndex];
    
    try {
      // Parse SVG path into commands
      const commands = parseSVGPath(pathData);
      
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      
      // Create path from SVG commands
      ctx.fillStyle = elevationColor;
      ctx.beginPath();
      
      let currentX = 0, currentY = 0;
      let pathStartX = 0, pathStartY = 0;
      
      commands.forEach(cmd => {
        switch (cmd.code) {
          case 'M': // Move to
            currentX = cmd.x;
            currentY = cmd.y;
            pathStartX = currentX;
            pathStartY = currentY;
            ctx.moveTo(currentX, currentY);
            break;
            
          case 'L': // Line to
            currentX = cmd.x;
            currentY = cmd.y;
            ctx.lineTo(currentX, currentY);
            break;
            
          case 'C': // Cubic Bezier curve (absolute)
            ctx.bezierCurveTo(
              cmd.x1, cmd.y1,
              cmd.x2, cmd.y2,
              cmd.x, cmd.y
            );
            currentX = cmd.x;
            currentY = cmd.y;
            break;
            
          case 'c': // Cubic Bezier curve (relative)
            ctx.bezierCurveTo(
              currentX + cmd.x1, currentY + cmd.y1,
              currentX + cmd.x2, currentY + cmd.y2,
              currentX + cmd.x, currentY + cmd.y
            );
            currentX += cmd.x;
            currentY += cmd.y;
            break;
            
          case 'Q': // Quadratic Bezier curve (absolute)
            ctx.quadraticCurveTo(
              cmd.x1, cmd.y1,
              cmd.x, cmd.y
            );
            currentX = cmd.x;
            currentY = cmd.y;
            break;
            
          case 'q': // Quadratic Bezier curve (relative)
            ctx.quadraticCurveTo(
              currentX + cmd.x1, currentY + cmd.y1,
              currentX + cmd.x, currentY + cmd.y
            );
            currentX += cmd.x;
            currentY += cmd.y;
            break;
            
          case 'l': // Line to (relative)
            currentX += cmd.x;
            currentY += cmd.y;
            ctx.lineTo(currentX, currentY);
            break;
            
          case 'h': // Horizontal line (relative)
            currentX += cmd.x;
            ctx.lineTo(currentX, currentY);
            break;
            
          case 'v': // Vertical line (relative)
            currentY += cmd.y;
            ctx.lineTo(currentX, currentY);
            break;
            
          case 'S': // Smooth cubic Bezier (absolute)
            ctx.bezierCurveTo(
              currentX, currentY, // Use current point as control point
              cmd.x2, cmd.y2,
              cmd.x, cmd.y
            );
            currentX = cmd.x;
            currentY = cmd.y;
            break;
            
          case 's': // Smooth cubic Bezier (relative)
            ctx.bezierCurveTo(
              currentX, currentY, // Use current point as control point
              currentX + cmd.x2, currentY + cmd.y2,
              currentX + cmd.x, currentY + cmd.y
            );
            currentX += cmd.x;
            currentY += cmd.y;
            break;
            
          case 'A': // Arc
            // Simplified arc handling - approximate with curves
            ctx.lineTo(cmd.x, cmd.y);
            currentX = cmd.x;
            currentY = cmd.y;
            break;
            
          case 'Z': // Close path
            ctx.closePath();
            currentX = pathStartX;
            currentY = pathStartY;
            break;
            
          default:
            console.warn(`Unsupported SVG command: ${cmd.code}`);
        }
      });
      
      ctx.fill();
      ctx.restore();
      
      console.log(`✏️  Path ${index + 1}: ${elevationColor} (${commands.length} commands)`);
    } catch (error) {
      console.warn(`⚠️  Failed to render path ${index + 1}:`, error.message);
      
      // Fallback to simple approximation if path parsing fails
      ctx.save();
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);
      
      const centerX = svgWidth / 2;
      const centerY = svgHeight / 2;
      const baseRadius = Math.min(svgWidth, svgHeight) / 3;
      const radius = baseRadius - (index * baseRadius / pathArray.length);
      
      ctx.fillStyle = elevationColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      console.log(`⚠️  Fallback circle for path ${index + 1}: radius ${radius.toFixed(1)}`);
    }
  });

  // Add subtle blur for smoother displacement
  ctx.filter = 'blur(1px)';
  const tempCanvas = createCanvas(width, height);
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0);

  // Export heightmap
  const buffer = canvas.toBuffer('image/png');
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`✅ Heightmap generated successfully!`);
  console.log(`📍 Saved to: ${outputPath}`);
  console.log(`📐 Dimensions: ${width}x${height}px`);
  console.log(`🎨 Elevation levels: ${pathArray.length}`);
  console.log('');
  console.log('🎯 Usage in Three.js:');
  console.log('const loader = new THREE.TextureLoader();');
  console.log('const heightmap = loader.load("/assets/heightmap.png");');
  console.log('const material = new THREE.MeshStandardMaterial({');
  console.log('  displacementMap: heightmap,');
  console.log('  displacementScale: 20, // Reduced for more realistic elevation');
  console.log('  wireframe: true');
  console.log('});');

} catch (error) {
  console.error('❌ Error generating heightmap:', error);
  process.exit(1);
}