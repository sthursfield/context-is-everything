'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

interface HeightmapMountainMeshProps {
  currentColor: string
  mousePosition: { x: number; y: number }
  onColorChange?: (color: string) => void
}

function HeightmapMountainMesh({ currentColor, mousePosition, onColorChange }: HeightmapMountainMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [heightTexture, setHeightTexture] = useState<THREE.Texture | null>(null)
  const [, setAnimationProgress] = useState(0) // 0 = flat, 1 = full mountain
  const animationTween = useRef<gsap.core.Tween | null>(null)

  // Load heightmap texture
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(
      '/assets/heightmap.png',
      (texture) => {
        // Configure texture for optimal displacement mapping
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        setHeightTexture(texture)
        console.log('🏔️  Heightmap loaded successfully')
      },
      (progress) => {
        console.log('📦 Loading heightmap:', (progress.loaded / progress.total * 100).toFixed(0) + '%')
      },
      (error) => {
        console.error('❌ Failed to load heightmap:', error)
      }
    )
  }, [])

  // Initialize with TRUE flat topographical view (tree rings from directly above)
  useEffect(() => {
    if (meshRef.current && heightTexture) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      
      // Start with ZERO displacement and PERFECTLY horizontal view (looking down at tree rings)
      material.displacementScale = 0
      
      // Position COMPLETELY flat - looking down at map from above (no angle whatsoever)
      meshRef.current.rotation.x = -Math.PI / 2 // Perfectly horizontal (top-down view)
      meshRef.current.rotation.y = 0
      meshRef.current.rotation.z = 0
      
      console.log('🗺️ Starting with flat topographical view - waiting 5 seconds for logo display...')
      
      // MINIMUM 3-second delay before any animation starts (so logo is fully visible first)
      const timer = setTimeout(() => {
        console.log('⏰ 5-second delay complete - beginning mountain transformation')
        
        // Animate to 3D mountain formation
        animationTween.current = gsap.to(
          { progress: 0 },
          {
            progress: 1,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: function() {
              const progress = this.targets()[0].progress
              setAnimationProgress(progress)
              
              // Elevation rises (displacement increases)
              material.displacementScale = progress * 2.5 // Much lower for clean tree rings
              
              // Rotation reveals 3D shape (from perfectly flat to angled 3D view)
              meshRef.current!.rotation.x = -Math.PI / 2 + (progress * 0.4) // Tilt up for 3D view
              meshRef.current!.rotation.y = progress * 0.3 // Slight horizontal rotation
              
              // Trigger color changes during animation too
              if (onColorChange) {
                const elevationStates = [
                  '#FF7A59', // Low elevation - warm orange
                  '#E67E44', // Medium-low - warmer
                  '#D2451E', // Medium - base orange
                  '#B8341A', // Medium-high - deeper
                  '#A02916', // High - rich red-orange
                  '#881F12'  // Peak - deepest red
                ]
                const stateIndex = Math.floor(progress * (elevationStates.length - 1))
                const newColor = elevationStates[stateIndex]
                console.log(`🏔️ Animation progress: ${(progress*100).toFixed(1)}%, color: ${newColor}`)
                onColorChange(newColor)
              }
            },
            onComplete: () => {
              console.log('🏔️ Mountain transformation complete - now interactive')
            }
          }
        )
      }, 5000) // 5-second delay to ensure logo is fully visible
      
      return () => {
        clearTimeout(timer)
        if (animationTween.current) {
          animationTween.current.kill()
        }
      }
    }
  }, [heightTexture, onColorChange])

  // Mouse interaction - REVERSIBLE elevation and rotation control
  useFrame(() => {
    if (meshRef.current && heightTexture) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      
      // Mouse controls both elevation (Y) and rotation (X) - REVERSIBLE
      // Y position controls mountain height (displacement)
      const mouseElevationControl = (mousePosition.y + 1) / 2 // Convert -1,1 to 0,1
      const targetElevation = mouseElevationControl * 2.5 // 0 = flat, 2.5 = clean mountain
      
      // X position controls horizontal rotation
      const targetRotationY = mousePosition.x * Math.PI // Full rotation
      
      // Dynamic tilt based on elevation - higher mountains get more dramatic angle
      const baseTilt = -Math.PI / 2 // Start horizontal
      const maxTilt = 0.5 // Maximum tilt angle
      const targetRotationX = baseTilt + (mouseElevationControl * maxTilt)
      
      // Smooth interpolation for all controls
      material.displacementScale = THREE.MathUtils.lerp(
        material.displacementScale,
        targetElevation,
        0.08
      )
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.08
      )
      
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.08
      )
      
      // Update animation progress for color synchronization
      const currentProgress = material.displacementScale / 2.5
      setAnimationProgress(currentProgress)
      
      // Trigger color changes based on elevation state
      if (onColorChange) {
        const elevationStates = [
          '#FF7A59', // Low elevation - warm orange
          '#E67E44', // Medium-low - warmer
          '#D2451E', // Medium - base orange
          '#B8341A', // Medium-high - deeper
          '#A02916', // High - rich red-orange
          '#881F12'  // Peak - deepest red
        ]
        const stateIndex = Math.floor(currentProgress * (elevationStates.length - 1))
        onColorChange(elevationStates[stateIndex])
      }
    }
  })

  // Update material color when currentColor changes
  useEffect(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.color.setHex(parseInt(currentColor.replace('#', ''), 16))
    }
  }, [currentColor])

  if (!heightTexture) {
    // Loading placeholder
    return (
      <mesh>
        <planeGeometry args={[4, 4, 32, 32]} />
        <meshStandardMaterial 
          color={currentColor}
          wireframe={true}
          opacity={0.3}
          transparent={true}
        />
      </mesh>
    )
  }

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[6, 6, 128, 128]} />
      <meshStandardMaterial
        color="#FF7A59" // Lighter complementary color
        displacementMap={heightTexture}
        displacementScale={0} // Controlled by mouse interaction
        wireframe={true}
        transparent={true}
        opacity={0.8}
        side={THREE.DoubleSide}
        wireframeLinewidth={0.5}
        // Make black areas (no displacement) completely invisible - only show elevated contours
        alphaTest={0.2} // Hide pixels with low displacement (black background areas)
      />
    </mesh>
  )
}

function CameraSetup() {
  const { camera } = useThree()
  
  useEffect(() => {
    // Position camera much further back for infinite space feeling
    // Start from an elevated perspective for dramatic intro
    camera.position.set(0, 8, 16)
    camera.lookAt(0, 0, 0)
    
    // Animate to final viewing position with breathing room
    gsap.to(camera.position, {
      duration: 4,
      x: 2,
      y: 4, 
      z: 12,
      ease: "power2.out"
    })
  }, [camera])
  
  return null
}

interface HeightmapMountainProps {
  currentColor: string
  mousePosition: { x: number; y: number }
  className?: string
  onColorChange?: (color: string) => void
}

export default function HeightmapMountain({ currentColor, mousePosition, className = '', onColorChange }: HeightmapMountainProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Lazy loading and performance optimization
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    const element = document.querySelector('.heightmap-mountain-container')
    if (element) observer.observe(element)
    
    return () => observer.disconnect()
  }, [])

  // Progressive enhancement fallback
  if (!isVisible) {
    return (
      <div 
        className={`heightmap-mountain-container ${className} flex items-center justify-center`}
        style={{ height: '400px', minHeight: '400px' }}
      >
        <svg 
          viewBox="0 0 400 300" 
          width="400" 
          height="300" 
          role="img" 
          aria-label="3D Mountain visualization loading..."
        >
          <g fill="none" stroke={currentColor} strokeWidth="2">
            <circle cx="200" cy="150" r="120" opacity="0.3" />
            <circle cx="200" cy="150" r="90" opacity="0.5" />
            <circle cx="200" cy="150" r="60" opacity="0.7" />
            <circle cx="200" cy="150" r="30" opacity="0.9" />
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div 
      className={`heightmap-mountain-container ${className}`} 
      style={{ 
        height: '500px', // Fixed height instead of 100%
        width: '100%',
        overflow: 'visible', // Critical for infinite space
        position: 'relative',
        zIndex: 1
      }}
    >
      <Canvas
        camera={{ 
          position: [0, 8, 16],
          fov: 45, // Narrower FOV for more dramatic perspective
          near: 0.1,
          far: 10000 // Much larger far plane for infinite space
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        style={{ 
          background: 'transparent',
          width: '100%',
          height: '100%'
        }}
        frameloop={reducedMotion ? 'never' : 'always'}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {/* Enhanced lighting for floating mountain in infinite space */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[20, 20, 10]} 
          intensity={1.0}
          castShadow={false}
        />
        <pointLight 
          position={[-15, 10, 15]} 
          intensity={0.4}
          color="#ffffff" 
        />
        <pointLight 
          position={[0, -5, 10]} 
          intensity={0.2}
          color={currentColor} 
        />
        
        <CameraSetup />
        
        <HeightmapMountainMesh
          currentColor={currentColor}
          mousePosition={mousePosition}
          onColorChange={onColorChange}
        />
      </Canvas>
    </div>
  )
}