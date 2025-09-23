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
      isMobile ? 75 : 50,  // Wider FOV on mobile
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    camera.position.z = isMobile ? 3 : 5;  // Closer on mobile to fill screen
    camera.lookAt(0, 0, 0);
    // Rotate camera 90 degrees around Z axis
    camera.rotation.z = Math.PI / 2;

    // Renderer with explicit mobile viewport handling
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    
    // Force full viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    renderer.setSize(width, height);
    // Dynamic background based on theme - use white for light theme
    const bgColor = currentTheme === 'dark' ? 0x372528 : 0xffffff;
    renderer.setClearColor(bgColor, 1);
    console.log('🎨 Mountain theme:', currentTheme, 'bgColor:', bgColor.toString(16));
    
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
    let animationProgress = 0
    let isReady = false

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
            
            const scale = window.innerWidth < 768 ? 0.025 : 0.01  // Much larger on mobile
            
            commands.forEach(cmd => {
              switch (cmd.code) {
                case 'M':
                  currentX = cmd.x
                  currentY = cmd.y
                  points.push(new THREE.Vector3(
                    (currentX - 165) * scale,
                    -(currentY - 143) * scale, 
                    0
                  ))
                  break
                case 'L':
                  currentX = cmd.x
                  currentY = cmd.y
                  points.push(new THREE.Vector3(
                    (currentX - 165) * scale,
                    -(currentY - 143) * scale,
                    0
                  ))
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
              // High contrast colors for visibility testing
              const contourColor = currentTheme === 'dark' ? 0xff0000 : 0x000000; // Red on dark, black on light
              const material = new THREE.LineBasicMaterial({
                color: contourColor,
                linewidth: 4,
                transparent: false,
                opacity: 1
              })
              const line = new THREE.LineLoop(geometry, material)

              // Set elevation data
              line.userData.elevation = (sortedPaths.length - i) * 0.5

              console.log(`🏔️ Created contour ring ${i}:`, {
                points: points.length,
                elevation: line.userData.elevation,
                color: contourColor.toString(16),
                theme: currentTheme
              })

              rings.push(line)
              scene.add(line)
            }
          } catch (error) {
            console.warn(`Failed to parse organic contour ${i}:`, error)
          }
        })
        
        // Remove second smallest ring for better profile
        const filteredRings = rings.filter((ring, index) => {
          if (index === rings.length - 2 && rings.length > 2) {
            scene.remove(ring)
            return false
          }
          return true
        })
        
        ringsRef.push(...filteredRings)
        isReady = true
        
        console.log(`✅ Created ${filteredRings.length} organic mountain rings`)
        
        // Start animation after delay
        setTimeout(() => {
          startCyclingAnimation()
        }, 2000)
        
      } catch (error) {
        console.error('❌ Failed to load organic mountain contours:', error)
      }
    }
    
    // Animation functions
    const updateMountainElevation = () => {
      ringsRef.forEach((ring) => {
        if (ring && ring.geometry.attributes.position) {
          const positions = ring.geometry.attributes.position.array as Float32Array
          const targetElevation = THREE.MathUtils.lerp(0, ring.userData.elevation, animationProgress)
          
          for (let k = 0; k < positions.length; k += 3) {
            positions[k + 2] = targetElevation
          }
          ring.geometry.attributes.position.needsUpdate = true
        }
      })
    }
    
    const startCyclingAnimation = () => {
      // Create a continuous breathing animation
      gsap.to({ progress: 0 }, {
        progress: 1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        onUpdate: function() {
          animationProgress = this.targets()[0].progress
          updateMountainElevation()
        }
      })
    }

    // Start mountain creation
    createMountainRings()

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Gentle rotation animation
      if (isReady) {
        scene.rotation.y += 0.002
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