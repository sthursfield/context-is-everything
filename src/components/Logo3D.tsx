'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Create wireframe tube ring from SVG path
function createWireframeRing(pathString: string) {
  try {
    // Parse SVG path into smooth curve points
    const points = parseSVGPathToCurve(pathString)
    
    // Ensure we have enough points for a valid curve
    if (points.length < 3) {
      console.error('createWireframeRing: insufficient points for curve creation')
      throw new Error('Insufficient points for curve')
    }
    
    // Create a smooth curve from the points
    const curve = new THREE.CatmullRomCurve3(points, true) // true for closed curve
    
    // Create tube geometry along the curve
    const tubeRadius = 0.02 // Very thin tube for elegant wireframe look
    const radialSegments = 8 // Circular cross-section
    const tubularSegments = 64 // Smooth curve
    
    const geometry = new THREE.TubeGeometry(curve, tubularSegments, tubeRadius, radialSegments, true)
    
    return geometry
  } catch (error) {
    console.error('createWireframeRing error:', error)
    // Fallback to a simple torus geometry
    return new THREE.TorusGeometry(2, 0.02, 8, 64)
  }
}

// Parse SVG path into 3D curve points
function parseSVGPathToCurve(pathString: string): THREE.Vector3[] {
  const scale = 0.025 // Scale for proper 3D size
  const points: THREE.Vector3[] = []
  
  let pathPoints: number[][] = []
  
  // Extract coordinates from the exact brand paths
  if (pathString.includes('M200,120')) {
    // Inner ring - create smooth oval from bezier curve
    pathPoints = [
      [200, 120], [230, 110], [270, 130], [280, 160], 
      [290, 190], [250, 210], [220, 220], [190, 230], 
      [150, 220], [140, 190], [130, 160], [170, 130]
    ]
  } else if (pathString.includes('M200,90')) {
    // Middle ring
    pathPoints = [
      [200, 90], [250, 80], [300, 120], [310, 170], 
      [320, 220], [260, 250], [210, 260], [160, 270], 
      [100, 240], [110, 180], [120, 130], [150, 100]
    ]
  } else {
    // Outer ring (default fallback)
    pathPoints = [
      [200, 60], [270, 50], [340, 110], [350, 180], 
      [360, 250], [280, 290], [210, 300], [140, 310], 
      [70, 260], [80, 180], [90, 120], [130, 70]
    ]
  }
  
  // Convert to Vector3 points
  pathPoints.forEach(([x, y]) => {
    points.push(new THREE.Vector3(
      (x - 200) * scale, 
      -(y - 200) * scale, 
      0
    ))
  })
  
  // Ensure we have at least 3 points for a valid curve
  if (points.length < 3) {
    console.warn('parseSVGPathToCurve: insufficient points, using default circle')
    // Create a simple circle as fallback
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      points.push(new THREE.Vector3(
        Math.cos(angle) * 2 * scale,
        Math.sin(angle) * 2 * scale,
        0
      ))
    }
  }
  
  return points
}

interface ContourRingProps {
  pathString: string
  position: [number, number, number]
  currentColor: string
}

// Wireframe ring component - thin elegant rings floating in space
function WireframeRing({ pathString, position, currentColor }: ContourRingProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [geometry] = useState(() => createWireframeRing(pathString))
  
  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshBasicMaterial 
        color={currentColor}
        transparent={true}
        opacity={0.9}
        wireframe={false} // We want the tube surface, not wireframe of the tube
      />
    </mesh>
  )
}

interface MouseInteractionGroupProps {
  children: React.ReactNode
  mousePosition: { x: number; y: number }
}

function MouseInteractionGroup({ children, mousePosition }: MouseInteractionGroupProps) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current) {
      // Enhanced smooth interpolation for complete rotational freedom
      const targetRotationX = mousePosition.y * 1.2 // Maximum sensitivity for full viewport experience
      const targetRotationY = mousePosition.x * 1.2
      const targetRotationZ = (mousePosition.x + mousePosition.y) * 0.4
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 
        targetRotationX, 
        0.08 // Slightly faster interpolation
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 
        targetRotationY, 
        0.08
      )
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, 
        targetRotationZ, 
        0.08
      )
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

interface Logo3DProps {
  currentColor: string
  mousePosition: { x: number; y: number }
  className?: string
}

export default function Logo3D({ currentColor, mousePosition, className = '' }: Logo3DProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  const brandPaths = [
    "M200,120 C230,110 270,130 280,160 C290,190 250,210 220,220 C190,230 150,220 140,190 C130,160 170,130 200,120Z",
    "M200,90 C250,80 300,120 310,170 C320,220 260,250 210,260 C160,270 100,240 110,180 C120,130 150,100 200,90Z", 
    "M200,60 C270,50 340,110 350,180 C360,250 280,290 210,300 C140,310 70,260 80,180 C90,120 130,70 200,60Z"
  ]
  
  // Lazy loading and performance optimization
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    const element = document.querySelector('.logo-3d-container')
    if (element) observer.observe(element)
    
    return () => observer.disconnect()
  }, [])
  
  // Progressive enhancement - fallback to static SVG
  if (!isVisible) {
    return (
      <div 
        className={`logo-3d-container ${className} flex items-center justify-center`}
        style={{ height: '200px', minHeight: '200px' }}
      >
        {/* Static SVG fallback for performance */}
        <svg 
          viewBox="0 0 400 400" 
          width="200" 
          height="200" 
          role="img" 
          aria-label="Context is Everything logo - geometric contour rings"
        >
          <g fill="none" stroke={currentColor} strokeWidth="2">
            <path d="M200,120 C228,110 268,124 279,155 C290,186 252,208 220,218 C188,228 148,220 137,192 C126,164 168,132 200,120Z"/>
            <path d="M200,90 C246,80 296,118 309,165 C322,212 260,246 208,258 C156,270 96,246 108,186 C120,126 152,98 200,90Z"/>
            <path d="M200,60 C269,50 336,110 350,180 C364,250 288,286 214,298 C140,310 74,266 86,186 C98,106 138,70 200,60Z"/>
          </g>
        </svg>
      </div>
    )
  }
  
  return (
    <div 
      className={`logo-3d-container ${className}`} 
      style={{ 
        height: '100%', 
        width: '100%',
        minHeight: '300px', 
        minWidth: '400px',
        overflow: 'visible' // Remove clipping for full rotational freedom
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 12], // Pull camera back for better view
          fov: 50, // Wider field of view
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: window.devicePixelRatio <= 1,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true // Enable depth for proper 3D rendering
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        frameloop={reducedMotion ? 'never' : 'always'}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {/* Optimized lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[8, 8, 8]} 
          intensity={0.8}
          castShadow={false}
        />
        <pointLight 
          position={[-8, -8, 8]} 
          intensity={0.3} 
          color="#ffffff"
        />
        
        {!reducedMotion ? (
          <MouseInteractionGroup mousePosition={mousePosition}>
            {brandPaths.map((path, index) => (
              <WireframeRing
                key={index}
                pathString={path}
                position={[0, 0, index * 0.1]} // Closer spacing for concentric effect
                currentColor={currentColor}
              />
            ))}
          </MouseInteractionGroup>
        ) : (
          // Static version for reduced motion
          <>
            {brandPaths.map((path, index) => (
              <WireframeRing
                key={index}
                pathString={path}
                position={[0, 0, index * 0.1]}
                currentColor={currentColor}
              />
            ))}
          </>
        )}
      </Canvas>
    </div>
  )
}