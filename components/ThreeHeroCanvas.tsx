import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 15;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    // Floating particles & meshes
    const group = new THREE.Group();
    scene.add(group);

    // Create 20 floating geometric objects
    const geometries = [
      new THREE.IcosahedronGeometry(0.8, 1),
      new THREE.TorusGeometry(1.0, 0.2, 16, 32),
      new THREE.OctahedronGeometry(0.7),
      new THREE.BoxGeometry(0.9, 0.9, 0.9)
    ];

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xec4899, wireframe: true, transparent: true, opacity: 0.5 })
    ];

    const meshes: { mesh: THREE.Mesh; rotSpeed: { x: number; y: number }; floatOffset: number }[] = [];

    for (let i = 0; i < 24; i++) {
      const geo = geometries[Math.floor(Math.random() * geometries.length)];
      const mat = materials[Math.floor(Math.random() * materials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 12
      );

      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);

      meshes.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015
        },
        floatOffset: Math.random() * Math.PI * 2
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6366f1, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 3, 20);
    pointLight2.position.set(-5, -5, 2);
    scene.add(pointLight2);

    // Mouse reaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera tilt based on mouse position
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Animate individual floating shapes
      meshes.forEach(({ mesh, rotSpeed, floatOffset }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.position.y += Math.sin(elapsedTime * 1.5 + floatOffset) * 0.005;
      });

      group.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60" />;
};
