// components/WireframeMountainMobile.tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import originalContourGeometry from "@/components/OriginalMountainGeometry"; // your desktop contour mesh

export default function WireframeMountainMobile() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera - wider FOV and closer to fill screen
    const camera = new THREE.PerspectiveCamera(
      90, // Much wider field of view
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8; // Closer to mountain
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);


    // Original contour mesh
    const geometry = originalContourGeometry;

    const mountainMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xff8800, wireframe: true })
    );

    // Scale much larger to fill entire screen
    mountainMesh.scale.set(15, 15, 15);
    mountainMesh.position.set(0, 0, 0);

    scene.add(mountainMesh);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mountainMesh.rotation.y += 0.002; // horizontal spin
      mountainMesh.rotation.x += 0.0005; // slight vertical tilt
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Keep the large scale to fill screen
      mountainMesh.scale.set(15, 15, 15);
      mountainMesh.position.set(0, 0, 0);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-screen h-screen z-0" />;
}