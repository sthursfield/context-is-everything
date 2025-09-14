import * as THREE from "three";

// Create the original contour mountain geometry with proper scaling
const createOriginalMountainGeometry = () => {
  // Create a much larger plane to fill the screen
  const geometry = new THREE.PlaneGeometry(40, 40, 64, 64);
  const positions = geometry.attributes.position.array as Float32Array;
  
  // Create realistic mountain contour elevations
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    
    // Create mountain ridges and valleys that look like contour lines
    const ridge1 = Math.sin(x * 0.1) * Math.cos(y * 0.15) * 3;
    const ridge2 = Math.sin(x * 0.08) * Math.sin(y * 0.12) * 2.5;
    const ridge3 = Math.sin(x * 0.12) * Math.cos(y * 0.1) * 2;
    const noise = (Math.random() - 0.5) * 0.8;
    
    // Combine ridges for complex mountain topology
    const elevation = ridge1 + ridge2 + ridge3 + noise;
    
    positions[i + 2] = elevation;
  }
  
  geometry.attributes.position.needsUpdate = true;
  return geometry;
};

const originalContourGeometry = createOriginalMountainGeometry();

export default originalContourGeometry;