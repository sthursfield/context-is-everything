'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import * as parseSVGPath from 'svg-path-parser'

interface WireframeMountainMeshProps {
  mousePosition: { x: number; y: number }
}

function WireframeMountainMesh({ }: WireframeMountainMeshProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [isReady, setIsReady] = useState(false)
  const ringsRef = useRef<THREE.LineLoop[]>([])
  const animationProgress = useRef(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load SVG contours and create rings - EXACTLY like your working model
  useEffect(() => {
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
        
        console.log(`📍 Found ${contourPaths.length} organic contour paths`)
        
        // Sort by path complexity (largest contours first) - like your ringCount approach
        const sortedPaths = contourPaths.sort((a, b) => {
          const aData = a.getAttribute('d') || ''
          const bData = b.getAttribute('d') || ''
          return bData.length - aData.length
        })
        
        console.log('🔍 Sorted paths by complexity:', sortedPaths.map((p, i) => ({
          index: i,
          pathLength: (p.getAttribute('d') || '').length,
          className: p.getAttribute('class')
        })))
        
        const rings: THREE.LineLoop[] = []
        const scene = groupRef.current
        if (!scene) return
        
        // Create rings - EXACTLY like your working model structure
        sortedPaths.forEach((path, i) => {
          const pathData = path.getAttribute('d')
          if (!pathData) return
          
          try {
            // Convert SVG path to Three.js points
            const commands = parseSVGPath.parseSVG(pathData)
            const points: THREE.Vector3[] = []
            let currentX = 0, currentY = 0
            
            // Optimized scale - large enough to see, small enough to avoid clipping
            const scale = window.innerWidth < 768 ? 0.5 : 0.35 // Balanced mobile scale
            
            commands.forEach(cmd => {
              switch (cmd.code) {
                case 'M':
                  currentX = cmd.x
                  currentY = cmd.y
                  points.push(new THREE.Vector3(currentX * scale, -currentY * scale, 0)) // Responsive scale
                  break
                case 'L':
                  currentX = cmd.x
                  currentY = cmd.y
                  points.push(new THREE.Vector3(currentX * scale, -currentY * scale, 0)) // Responsive scale
                  break
                case 'C':
                  // Approximate bezier with line segments
                  for (let t = 0.1; t <= 1; t += 0.2) {
                    const x = Math.pow(1-t, 3) * currentX + 
                             3 * Math.pow(1-t, 2) * t * cmd.x1 +
                             3 * (1-t) * Math.pow(t, 2) * cmd.x2 + 
                             Math.pow(t, 3) * cmd.x
                    const y = Math.pow(1-t, 3) * currentY + 
                             3 * Math.pow(1-t, 2) * t * cmd.y1 +
                             3 * (1-t) * Math.pow(t, 2) * cmd.y2 + 
                             Math.pow(t, 3) * cmd.y
                    points.push(new THREE.Vector3(x * scale, -y * scale, 0)) // Responsive scale
                  }
                  currentX = cmd.x
                  currentY = cmd.y
                  break
                case 'c':
                  // Relative bezier
                  for (let t = 0.1; t <= 1; t += 0.2) {
                    const x = Math.pow(1-t, 3) * currentX + 
                             3 * Math.pow(1-t, 2) * t * (currentX + cmd.x1) +
                             3 * (1-t) * Math.pow(t, 2) * (currentX + cmd.x2) + 
                             Math.pow(t, 3) * (currentX + cmd.x)
                    const y = Math.pow(1-t, 3) * currentY + 
                             3 * Math.pow(1-t, 2) * t * (currentY + cmd.y1) +
                             3 * (1-t) * Math.pow(t, 2) * (currentY + cmd.y2) + 
                             Math.pow(t, 3) * (currentY + cmd.y)
                    points.push(new THREE.Vector3(x * scale, -y * scale, 0)) // Responsive scale
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
              const material = new THREE.LineBasicMaterial({ 
                color: 0xFF7A59 // Your specified orange color
              })
              const line = new THREE.LineLoop(geometry, material)
              
              // EXACTLY like your working model: (ringCount - i) * elevation
              // Larger rings (i=0) = lower elevation, smaller rings (i=7) = higher elevation
              line.userData.elevation = (sortedPaths.length - i) * 15 // Same as your working model
              
              rings.push(line)
              scene.add(line)
            }
          } catch (error) {
            console.warn(`Failed to parse organic contour ${i}:`, error)
          }
        })
        
        // Remove second SMALLEST ring (second to innermost) - not second largest
        const filteredRings = rings.filter((ring, index) => {
          if (index === rings.length - 2 && rings.length > 2) {
            console.log('🗑️ Removing second smallest ring for better mountain profile')
            scene.remove(ring)
            return false
          }
          return true
        })
        
        ringsRef.current = filteredRings
        setIsReady(true)
        
        console.log(`✅ Created ${filteredRings.length} organic mountain rings`)
        console.log('🔍 Ring details:', filteredRings.map((ring, i) => ({
          index: i,
          elevation: ring.userData.elevation,
          pointCount: ring.geometry.attributes.position.count
        })))
        
        // Start continuous cycling animation after 8 seconds (longer flat display)
        const timer = setTimeout(() => {
          startCyclingAnimation()
        }, 8000)
        
        return () => clearTimeout(timer)
        
      } catch (error) {
        console.error('❌ Failed to load organic mountain contours:', error)
      }
    }
    
    createMountainRings()
  }, [])

  // Move startCyclingAnimation outside useEffect to fix dependency warning  
  const startCyclingAnimation = () => {
    const animateCycle = () => {
      gsap.timeline({ repeat: -1 })
        .to(animationProgress, {
          current: 1,
          duration: 3,
          ease: "power2.inOut",
          onUpdate: updateMountainElevation
        })
        .to(animationProgress, {
          current: 1,
          duration: 5, // Longer hold at mountain peak (2s → 5s)
          ease: "none"
        })
        .to(animationProgress, {
          current: 0,
          duration: 3,
          ease: "power2.inOut", 
          onUpdate: updateMountainElevation
        })
        .to(animationProgress, {
          current: 0,
          duration: 3, // Longer pause at flat state (2s → 3s)
          ease: "none"
        })
    }
    
    animateCycle()
  }


  // Update mountain elevation based on animation progress - like spencert14 reference
  const updateMountainElevation = () => {
    const progress = animationProgress.current
    
    ringsRef.current.forEach((ring, i) => {
      if (ring && ring.geometry.attributes.position) {
        const positions = ring.geometry.attributes.position.array as Float32Array
        
        // Debug: Check if this ring is moving
        if (i === ringsRef.current.length - 1) {
          console.log(`🔍 Smallest ring (${i}) elevation: ${ring.userData.elevation}, progress: ${progress}`)
        }
        
        // Simple vertical rise like spencert14 - EXACTLY like working model
        // Each ring rises to its predetermined elevation * progress
        const targetElevation = THREE.MathUtils.lerp(0, ring.userData.elevation, progress)
        
        for (let k = 0; k < positions.length; k += 3) {
          positions[k + 2] = targetElevation
        }
        ring.geometry.attributes.position.needsUpdate = true
      }
    })
  }

  // Gentle rotation animation
  useFrame(() => {
    if (groupRef.current && isReady) {
      groupRef.current.rotation.y += 0.005 // Slow continuous rotation
    }
  })

  return <group ref={groupRef} position={[0, 0, 0]} /> // Center the mountain
}

function CameraSetup() {
  const { camera } = useThree()
  
  useEffect(() => {
    // Position camera to see the full mountain as it grows upward
    camera.position.set(0, 0, 400) // Move camera further back
    camera.lookAt(0, 30, 0) // Look at a higher point to see the mountain peak
  }, [camera])
  
  return null
}

interface WireframeMountainProps {
  mousePosition: { x: number; y: number }
  className?: string
}

export default function WireframeMountain({ mousePosition, className = '' }: WireframeMountainProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <div className={className} style={{ 
      position: isMobile ? 'fixed' : 'relative',
      top: isMobile ? 'calc(33vh - 15vh)' : 'auto', // 18vh from top (33vh chat position - 15vh above)
      left: isMobile ? '0' : 'auto', 
      width: isMobile ? '100vw' : '100%',
      height: isMobile ? '33vh' : '450px', // Animation area height
      overflow: 'visible',
      zIndex: -1, // Far behind everything
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center', // Center vertically within the area
      justifyContent: 'center' // Center horizontally
    }}>
      <Canvas
        camera={{
          position: [0, 0, 300],
          fov: isMobile ? 60 : 45, // Moderate FOV on mobile
          near: 0.1,
          far: 5000
        }}
        gl={{
          antialias: true,
          alpha: true
        }}
        style={{
          background: 'transparent',
          width: isMobile ? '100vw' : '100%',
          height: isMobile ? '200%' : '100%', // Extend canvas beyond container to prevent clipping
          position: 'absolute',
          top: isMobile ? '-50%' : '0', // Center the extended canvas
          left: '0'
        }}
      >
        <CameraSetup />
        <WireframeMountainMesh mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}