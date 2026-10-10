'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroThreeSceneProps {
  reducedMotion?: boolean;
}

export default function HeroThreeScene({ reducedMotion = false }: HeroThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Check WebGL support safely
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);
    setIsInteractive(true);

    // 3. Create Gesture Particle Constellations
    // Generating two complementary kinetic clusters resembling hands communicating through neural filaments
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCyan = new THREE.Color(0x06b6d4);
    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorGold = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Split into two distinct kinetic nodes (Left & Right hands bridging across center)
      const isLeft = i < particleCount / 2;
      const clusterCenter = isLeft ? -4.5 : 4.5;

      // Parametric hand/gesture cloud formation
      const u = Math.random() * Math.PI * 2;
      const v = (Math.random() - 0.5) * Math.PI;
      const radius = 2.2 + Math.random() * 1.6;

      const px = clusterCenter + radius * Math.cos(v) * Math.cos(u) + (Math.random() - 0.5) * 1.2;
      const py = radius * Math.sin(v) * 1.4 + (Math.random() - 0.5) * 1.5;
      const pz = radius * Math.cos(v) * Math.sin(u) + (Math.random() - 0.5) * 2.0;

      positions[i3] = px;
      positions[i3 + 1] = py;
      positions[i3 + 2] = pz;

      // Color gradation across the communicative bridge
      const mixRatio = (px + 6) / 12;
      const mixedColor = isLeft ? colorCyan.clone().lerp(colorViolet, Math.random() * 0.4) : colorViolet.clone().lerp(colorGold, Math.random() * 0.4);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = 1.0 + Math.random() * 2.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Custom glowing point material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 4. Undulating Neural Filaments (Bridging Gesture to AI)
    const curvePoints: THREE.Vector3[] = [];
    const filamentCount = 120;
    for (let i = 0; i <= filamentCount; i++) {
      const t = (i / filamentCount) * Math.PI * 2;
      const x = (i / filamentCount - 0.5) * 14;
      const y = Math.sin(t * 3) * 1.2;
      const z = Math.cos(t * 2) * 1.5;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeometry = new THREE.TubeGeometry(curve, 90, 0.04, 8, false);
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });
    const filamentMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(filamentMesh);

    // 5. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3, 25);
    cyanPointLight.position.set(-5, 2, 6);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0x8b5cf6, 3, 25);
    violetPointLight.position.set(5, -2, 6);
    scene.add(violetPointLight);

    // 6. Mouse Tracking & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // 7. Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!reducedMotion) {
        // Smooth camera dampening
        targetX += (mouseX * 2.5 - targetX) * 0.04;
        targetY += (mouseY * 1.5 - targetY) * 0.04;
        camera.position.x = targetX;
        camera.position.y = targetY;
        camera.lookAt(0, 0, 0);

        // Kinetic motion for particles
        particles.rotation.y = elapsedTime * 0.08;
        particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

        // Wave deformation for bridging filament
        filamentMesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.15;
        filamentMesh.rotation.y = elapsedTime * 0.04;

        // Subtle pulsing of point lights
        cyanPointLight.intensity = 2.4 + Math.sin(elapsedTime * 1.5) * 0.8;
        violetPointLight.intensity = 2.4 + Math.cos(elapsedTime * 1.5) * 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      tubeGeometry.dispose();
      tubeMaterial.dispose();
      renderer.dispose();
    };
  }, [reducedMotion]);

  if (!webGlSupported) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#07090e] via-[#0d121f] to-[#07090e] overflow-hidden pointer-events-none">
        <div className="relative w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-600/20 to-amber-500/20 blur-3xl animate-pulse" />
        <div className="absolute w-[24rem] h-[24rem] rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '30s' }} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
