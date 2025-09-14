"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BackgroundMountain() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("BackgroundMountain useEffect starting...");
    if (!mountRef.current) {
      console.log("mountRef.current is null, returning early");
      return;
    }
    console.log("mountRef.current exists:", mountRef.current);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
    
    // Log to confirm renderer attaches
    console.log("Renderer attached:", mountRef.current?.contains(renderer.domElement));

    // Example geometry: replace with your mountain mesh/geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    console.log("Starting animation loop...");
    animate();

    // Resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-screen md:h-full bg-black"
      style={{ position: "relative" }}
    />
  );
}