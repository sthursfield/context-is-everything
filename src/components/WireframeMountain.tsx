"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from 'gsap'
import * as parseSVGPath from 'svg-path-parser'

interface WireframeMountainProps {
  currentTheme?: 'dark' | 'light'
}

export default function WireframeMountain({ currentTheme = 'dark' }: WireframeMountainProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;

    // Scene and camera
    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(
      50,  // Consistent FOV like POC for proper mountain proportions
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    // Adjust camera position based on device (set to 10 to match POC setting)
    camera.position.set(0, 0, isMobile ? 10 : 10);
    camera.lookAt(0, 0, 0);
    console.log('📷 Camera position:', camera.position, 'rotation:', camera.rotation);

    // Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    // Force full viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    // Transparent background - let page background show through
    renderer.setClearColor(0x000000, 0); // Black with 0 alpha = transparent
    console.log('🎨 Mountain theme:', currentTheme, 'transparent background');
    
    // Force full viewport positioning - bypass any CSS constraints
    const canvas = renderer.domElement;
    canvas.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 1 !important;
      display: block !important;
      pointer-events: none !important;
    `;
    
    mount.appendChild(renderer.domElement);

    // Mountain creation - restore original contour rings
    const ringsRef: THREE.LineLoop[] = []
    const animationProgress = 0
    let isReady = false

    // Enhanced wave animation parameters (from POC settings)
    const waveParams = {
      waveSpeed: 15, // 15 seconds (from POC setting)
      phaseOffset: 0, // Phase offset 0 (from POC setting)
      elevationSpacing: 1, // Elevation spacing 1 (from POC setting)
      waveAmplitude: 1.5, // Wave amplitude 1.5 (from POC setting)
      waveDirection: 'inward', // Outward → Center (from POC setting)
      waveFunction: 'cosine', // Cosine wave (from POC setting)
      offScreenDistance: 2.5, // Off-screen distance 2.5 (from POC setting)
      rotationSpeed: 0.3 // Rotation speed 0.3 (from POC setting)
    }

    const createMountainRings = async () => {
      try {
        console.log('🏔️ Loading organic contour shapes...')
        
        // Load SVG
        const response = await fetch('/assets/flat-top.svg')
        const svgText = await response.text()
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const paths = svgDoc.querySelectorAll('path')
        
        // Filter only stroke paths (organic contours)
        const contourPaths = Array.from(paths).filter(path => {
          const className = path.getAttribute('class') || ''
          const fill = path.getAttribute('fill') || ''
          return className.includes('cls-') && (fill === 'none' || fill === '')
        })
        
        // Sort by path complexity (largest contours first)
        const sortedPaths = contourPaths.sort((a, b) => {
          const aData = a.getAttribute('d') || ''
          const bData = b.getAttribute('d') || ''
          return bData.length - aData.length
        })
        
        const rings: THREE.LineLoop[] = []
        
        // Create rings
        sortedPaths.forEach((path, i) => {
          const pathData = path.getAttribute('d')
          if (!pathData) return
          
          try {
            // Convert SVG path to Three.js points
            const commands = parseSVGPath.parseSVG(pathData)
            const points: THREE.Vector3[] = []
            let currentX = 0, currentY = 0
            
            const scale = window.innerWidth < 768 ? 0.048 : 0.06  // Mobile 40% smaller for better context visibility
            
            commands.forEach(cmd => {
              switch (cmd.code) {
                case 'M':
                  currentX = cmd.x
                  currentY = cmd.y
                  const x = (currentX - 165) * scale
                  const y = -(currentY - 143) * scale
                  points.push(new THREE.Vector3(x, y, 0))
                  if (points.length === 1) console.log(`First point raw: (${currentX}, ${currentY}) -> scaled: (${x.toFixed(3)}, ${y.toFixed(3)})`)
                  break
                case 'L':
                  currentX = cmd.x
                  currentY = cmd.y
                  const lx = (currentX - 165) * scale
                  const ly = -(currentY - 143) * scale
                  points.push(new THREE.Vector3(lx, ly, 0))
                  break
                case 'C':
                  // Approximate bezier with line segments
                  for (let t = 0.1; t <= 1; t += 0.1) {
                    const x = Math.pow(1-t, 3) * currentX + 
                             3 * Math.pow(1-t, 2) * t * cmd.x1 +
                             3 * (1-t) * Math.pow(t, 2) * cmd.x2 + 
                             Math.pow(t, 3) * cmd.x
                    const y = Math.pow(1-t, 3) * currentY + 
                             3 * Math.pow(1-t, 2) * t * cmd.y1 +
                             3 * (1-t) * Math.pow(t, 2) * cmd.y2 + 
                             Math.pow(t, 3) * cmd.y
                    points.push(new THREE.Vector3(
                      (x - 165) * scale,
                      -(y - 143) * scale,
                      0
                    ))
                  }
                  currentX = cmd.x
                  currentY = cmd.y
                  break
                case 'c':
                  // Relative bezier
                  for (let t = 0.1; t <= 1; t += 0.1) {
                    const x = Math.pow(1-t, 3) * currentX + 
                             3 * Math.pow(1-t, 2) * t * (currentX + cmd.x1) +
                             3 * (1-t) * Math.pow(t, 2) * (currentX + cmd.x2) + 
                             Math.pow(t, 3) * (currentX + cmd.x)
                    const y = Math.pow(1-t, 3) * currentY + 
                             3 * Math.pow(1-t, 2) * t * (currentY + cmd.y1) +
                             3 * (1-t) * Math.pow(t, 2) * (currentY + cmd.y2) + 
                             Math.pow(t, 3) * (currentY + cmd.y)
                    points.push(new THREE.Vector3(
                      (x - 165) * scale,
                      -(y - 143) * scale,
                      0
                    ))
                  }
                  currentX += cmd.x
                  currentY += cmd.y
                  break
                case 'Z':
                  // Close path by connecting to first point
                  if (points.length > 0) {
                    points.push(points[0].clone())
                  }
                  break
              }
            })
            
            if (points.length > 0) {
              const geometry = new THREE.BufferGeometry().setFromPoints(points)
              // Logo-inspired colors for light theme
              const contourColor = currentTheme === 'dark' ? 0xff8800 : 0x4C6577; // Gentle orange on dark, CONTEXT IS blue-grey on light
              const material = new THREE.LineBasicMaterial({
                color: contourColor,
                linewidth: 2,
                transparent: false,
                opacity: 1
              })
              const line = new THREE.LineLoop(geometry, material)

              // Set elevation data - much larger elevation differences and start at -5
              line.userData.elevation = -5 + (sortedPaths.length - i) * 2;

              console.log(`🏔️ Created contour ring ${i}:`, {
                points: points.length,
                elevation: line.userData.elevation,
                color: contourColor.toString(16),
                theme: currentTheme,
                firstPoint: points[0],
                lastPoint: points[points.length - 1],
                scale: scale
              })

              // Set initial position at z=0 (flat) - animation will bring them to elevation
              const positions = line.geometry.attributes.position.array as Float32Array
              for (let k = 0; k < positions.length; k += 3) {
                positions[k + 2] = 0; // Start flat
              }
              line.geometry.attributes.position.needsUpdate = true;

              rings.push(line)
              scene.add(line)
            }
          } catch (error) {
            console.warn(`Failed to parse organic contour ${i}:`, error)
          }
        })
        
        // Remove the second smallest ring (irregular shape) but keep the smallest
        const filteredRings = rings.filter((ring, index) => {
          if (index === rings.length - 2 && rings.length > 2) {
            scene.remove(ring)
            return false
          }
          return true
        })

        ringsRef.push(...filteredRings)
        isReady = true

        console.log(`✅ Created ${filteredRings.length} organic mountain rings - PROPER FILTERING ✨`)

        
        // Start animation after all rings are fully initialized
        setTimeout(() => {
          startCyclingAnimation()
        }, 1000) // Shorter delay for quicker startup
        
      } catch (error) {
        console.error('❌ Failed to load organic mountain contours:', error)
      }
    }
    
    // Animation functions

    // Enhanced animation with POC wave features
    const updateEnhancedMountainAnimation = (waveTime: number) => {
      ringsRef.forEach((ring, index) => {
        if (ring && ring.geometry.attributes.position) {
          // Calculate phase offset based on direction (POC feature)
          let phaseOffset = 0
          switch(waveParams.waveDirection) {
            case 'outward':
              phaseOffset = index * waveParams.phaseOffset
              break
            case 'inward':
              phaseOffset = (ringsRef.length - index - 1) * waveParams.phaseOffset
              break
          }

          // Calculate wave value with phase offset
          const t = waveTime + phaseOffset
          let waveValue

          switch(waveParams.waveFunction) {
            case 'sine':
              waveValue = Math.sin(t)
              break
            case 'cosine':
              waveValue = Math.cos(t)
              break
            default:
              waveValue = Math.sin(t)
          }

          // Normalize to 0-1 range and apply amplitude
          const normalizedWave = (waveValue + 1) / 2 * waveParams.waveAmplitude

          // Apply to ring elevation with enhanced spacing (POC method - move entire ring)
          const baseElevation = -2 + index * waveParams.elevationSpacing
          const targetElevation = baseElevation * normalizedWave

          // POC method: Move entire ring position (creates mountain, not funnel)
          ring.position.z = targetElevation

          // Add off-screen movement (additional Z-axis depth) - POC method
          const offScreenOffset = Math.sin(waveTime + phaseOffset) * waveParams.offScreenDistance
          ring.position.z += offScreenOffset

          ring.geometry.attributes.position.needsUpdate = true
        }
      })
    }
    
    const startCyclingAnimation = () => {
      // Enhanced wave animation with POC features - start truly flat
      gsap.to({ progress: Math.PI }, { // Start at π for cosine to begin at -1 (minimum)
        progress: Math.PI + Math.PI * 2, // Full wave cycle from minimum
        duration: waveParams.waveSpeed, // Configurable speed
        ease: "none", // Linear for consistent wave
        repeat: -1,
        onUpdate: function() {
          const waveTime = this.targets()[0].progress
          updateEnhancedMountainAnimation(waveTime)
        }
      })
    }

    // Start mountain creation
    createMountainRings()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Enhanced rotation with POC logic - X-axis oscillating rotation
      if (isReady) {
        const currentTime = Date.now()
        const rotationTime = currentTime / 1000 * waveParams.rotationSpeed * 0.1 // Much slower like POC
        scene.rotation.x = Math.sin(rotationTime) * Math.PI * 0.8 // ±144° range like POC
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize with explicit mobile viewport handling
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      
      // Reapply full viewport positioning on resize
      const canvas = renderer.domElement;
      canvas.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 1 !important;
        display: block !important;
        pointer-events: none !important;
      `;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [currentTheme]);

  return <div ref={mountRef} style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100vw', 
    height: '100vh', 
    zIndex: -1, 
    pointerEvents: 'none' 
  }} />;
}