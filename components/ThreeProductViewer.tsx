import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Sun, Maximize2, RefreshCw } from 'lucide-react';
import { Shape3DPreset } from '../types';

interface ThreeProductViewerProps {
  shapePreset: Shape3DPreset;
  primaryColor?: string;
  accentColor?: string;
  productName?: string;
  className?: string;
  height?: string;
}

export const ThreeProductViewer: React.FC<ThreeProductViewerProps> = ({
  shapePreset,
  primaryColor = '#6366f1',
  accentColor = '#a855f7',
  productName = '3D Просмотр товара',
  className = '',
  height = 'h-80 md:h-96'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeColor, setActiveColor] = useState(primaryColor);
  const [lightingMode, setLightingMode] = useState<'studio' | 'neon' | 'sunset'>('neon');
  const [isLoaded, setIsLoaded] = useState(false);

  // References for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  const colorPresets = [
    { label: 'Основной', hex: primaryColor },
    { label: 'Акцент', hex: accentColor },
    { label: 'Неоново-голубой', hex: '#00f0ff' },
    { label: 'Темный титан', hex: '#2a2d34' },
    { label: 'Золото', hex: '#eab308' }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(THREE.Color.NAMES[activeColor as keyof typeof THREE.Color.NAMES] || activeColor, 2, 10);
    pointLight.position.set(-3, -2, 3);
    scene.add(pointLight);

    // Group for product geometry
    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    // Create Mesh based on preset
    build3DMesh(meshGroup, shapePreset, activeColor, accentColor);

    setIsLoaded(true);

    // Animation Loop
    let rotationX = 0;
    let rotationY = 0;

    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);

      if (meshGroupRef.current) {
        if (autoRotate && !isDraggingRef.current) {
          meshGroupRef.current.rotation.y += 0.008;
          meshGroupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.15;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse Drag Rotation
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch Support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      meshGroupRef.current.rotation.y += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElem.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
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
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (domElem) {
        domElem.removeEventListener('mousedown', handleMouseDown);
        domElem.removeEventListener('touchstart', handleTouchStart);
      }
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, [shapePreset]);

  // Update mesh color when activeColor changes
  useEffect(() => {
    if (meshGroupRef.current) {
      meshGroupRef.current.clear();
      build3DMesh(meshGroupRef.current, shapePreset, activeColor, accentColor);
    }
  }, [activeColor, accentColor, shapePreset]);

  // Handle lighting mode
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    
    // Clear ambient & point lights
    scene.children.filter(child => child instanceof THREE.Light).forEach(light => scene.remove(light));

    if (lightingMode === 'neon') {
      const amb = new THREE.AmbientLight(0x111827, 1);
      scene.add(amb);

      const p1 = new THREE.PointLight(0x6366f1, 4, 15);
      p1.position.set(4, 4, 4);
      scene.add(p1);

      const p2 = new THREE.PointLight(0xa855f7, 4, 15);
      p2.position.set(-4, -4, 2);
      scene.add(p2);
    } else if (lightingMode === 'sunset') {
      const amb = new THREE.AmbientLight(0xffedd5, 1);
      scene.add(amb);

      const p1 = new THREE.PointLight(0xf97316, 5, 15);
      p1.position.set(5, 5, 3);
      scene.add(p1);

      const p2 = new THREE.PointLight(0xec4899, 3, 15);
      p2.position.set(-5, -2, -2);
      scene.add(p2);
    } else {
      // Studio
      const amb = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(amb);

      const d1 = new THREE.DirectionalLight(0xffffff, 2);
      d1.position.set(5, 8, 5);
      scene.add(d1);

      const d2 = new THREE.DirectionalLight(0xffffff, 0.8);
      d2.position.set(-5, -3, -5);
      scene.add(d2);
    }
  }, [lightingMode]);

  const handleResetView = () => {
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.set(0, 0, 0);
      meshGroupRef.current.position.set(0, 0, 0);
    }
  };

  return (
    <div className={`relative w-full rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between ${className}`}>
      {/* Top Bar Info & Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-500/30 text-xs font-medium text-slate-200 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>3D WebGL Интерактив</span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Остановить вращение' : 'Включить вращение'}
            className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1 ${
              autoRotate 
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-md shadow-indigo-500/20' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleResetView}
            title="Сбросить ракурс"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div 
        ref={mountRef} 
        className={`w-full ${height} cursor-grab active:cursor-grabbing flex items-center justify-center`} 
      />

      {/* Helper hint overlay */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-60 text-center">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 bg-slate-950/60 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800">
          Зажмите и потяните, чтобы вращать 360°
        </p>
      </div>

      {/* Bottom Customizer Bar */}
      <div className="z-10 p-3 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Color Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Цвет:</span>
          <div className="flex items-center gap-1.5">
            {colorPresets.map((cp, idx) => (
              <button
                key={idx}
                onClick={() => setActiveColor(cp.hex)}
                title={cp.label}
                className={`w-5 h-5 rounded-full border transition-all hover:scale-110 ${
                  activeColor === cp.hex ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 border-white scale-110' : 'border-slate-700 opacity-80'
                }`}
                style={{ backgroundColor: cp.hex }}
              />
            ))}
          </div>
        </div>

        {/* Lighting Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setLightingMode('neon')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'neon' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Неон
          </button>
          <button
            onClick={() => setLightingMode('studio')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'studio' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Студия
          </button>
          <button
            onClick={() => setLightingMode('sunset')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              lightingMode === 'sunset' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Закат
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to build 3D geometry objects in Three.js
function build3DMesh(group: THREE.Group, preset: Shape3DPreset, colorHex: string, accentHex: string) {
  const mainMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    metalness: 0.7,
    roughness: 0.2,
    envMapIntensity: 1.0,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(accentHex),
    metalness: 0.9,
    roughness: 0.1,
    emissive: new THREE.Color(accentHex),
    emissiveIntensity: 0.3
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    metalness: 0.95,
    roughness: 0.05
  });

  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.5,
    roughness: 0.5
  });

  if (preset === 'headphones') {
    // Headband arc
    const bandGeo = new THREE.TorusGeometry(1.6, 0.12, 16, 100, Math.PI);
    const bandMesh = new THREE.Mesh(bandGeo, darkMat);
    bandMesh.rotation.x = Math.PI / 2;
    bandMesh.position.y = 0.5;
    group.add(bandMesh);

    // Left Ear Cup
    const cupGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.4, 32);
    const leftCup = new THREE.Mesh(cupGeo, mainMat);
    leftCup.position.set(-1.6, 0.5, 0);
    leftCup.rotation.z = Math.PI / 2;

    const ringGeo = new THREE.TorusGeometry(0.75, 0.05, 16, 32);
    const leftRing = new THREE.Mesh(ringGeo, accentMat);
    leftRing.position.set(-1.8, 0.5, 0);
    leftRing.rotation.y = Math.PI / 2;

    // Right Ear Cup
    const rightCup = leftCup.clone();
    rightCup.position.set(1.6, 0.5, 0);

    const rightRing = leftRing.clone();
    rightRing.position.set(1.8, 0.5, 0);

    group.add(leftCup, leftRing, rightCup, rightRing);
  } else if (preset === 'smartwatch') {
    // Watch Case
    const caseGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.3, 32);
    const caseMesh = new THREE.Mesh(caseGeo, chromeMat);

    // Screen
    const screenGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.05, 32);
    const screenMesh = new THREE.Mesh(screenGeo, darkMat);
    screenMesh.position.y = 0.15;

    // Glowing rim
    const rimGeo = new THREE.TorusGeometry(1.2, 0.04, 16, 32);
    const rimMesh = new THREE.Mesh(rimGeo, accentMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.16;

    // Straps
    const strapGeo = new THREE.BoxGeometry(1.2, 0.1, 2.2);
    const topStrap = new THREE.Mesh(strapGeo, mainMat);
    topStrap.position.set(0, 0, 1.8);

    const bottomStrap = topStrap.clone();
    bottomStrap.position.set(0, 0, -1.8);

    group.add(caseMesh, screenMesh, rimMesh, topStrap, bottomStrap);
  } else if (preset === 'drone') {
    // Center body
    const bodyGeo = new THREE.BoxGeometry(1.4, 0.4, 1.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);

    // Camera gimbal
    const camGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const camMesh = new THREE.Mesh(camGeo, chromeMat);
    camMesh.position.set(0, -0.2, 0.9);

    // Arms
    const positions = [
      [1.4, 0, 1.2],
      [-1.4, 0, 1.2],
      [1.4, 0, -1.2],
      [-1.4, 0, -1.2]
    ];

    positions.forEach(([x, y, z]) => {
      const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 16);
      const arm = new THREE.Mesh(armGeo, darkMat);
      arm.position.set(x / 2, y, z / 2);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = Math.atan2(z, x);

      const propGuard = new THREE.TorusGeometry(0.7, 0.04, 16, 32);
      const guard = new THREE.Mesh(propGuard, accentMat);
      guard.position.set(x, y, z);
      guard.rotation.x = Math.PI / 2;

      // Propeller blade
      const propGeo = new THREE.BoxGeometry(1.2, 0.02, 0.1);
      const prop = new THREE.Mesh(propGeo, chromeMat);
      prop.position.set(x, y + 0.1, z);

      group.add(arm, guard, prop);
    });

    group.add(bodyMesh, camMesh);
  } else if (preset === 'glasses') {
    // Frame
    const frameGeo = new THREE.BoxGeometry(3.2, 0.8, 0.2);
    const frameMesh = new THREE.Mesh(frameGeo, mainMat);

    // Lenses
    const lensGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.1, 32);
    const leftLens = new THREE.Mesh(lensGeo, accentMat);
    leftLens.rotation.x = Math.PI / 2;
    leftLens.position.set(-0.8, 0, 0.05);

    const rightLens = leftLens.clone();
    rightLens.position.set(0.8, 0, 0.05);

    group.add(frameMesh, leftLens, rightLens);
  } else if (preset === 'cylinder' || preset === 'speaker') {
    const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.8, 32);
    const cylMesh = new THREE.Mesh(cylGeo, mainMat);

    const topRingGeo = new THREE.TorusGeometry(1.21, 0.06, 16, 32);
    const topRing = new THREE.Mesh(topRingGeo, accentMat);
    topRing.rotation.x = Math.PI / 2;
    topRing.position.y = 1.35;

    const bottomRing = topRing.clone();
    bottomRing.position.y = -1.35;

    group.add(cylMesh, topRing, bottomRing);
  } else if (preset === 'earbuds') {
    const caseGeo = new THREE.BoxGeometry(2.0, 1.2, 1.2);
    const caseMesh = new THREE.Mesh(caseGeo, mainMat);

    const stripeGeo = new THREE.BoxGeometry(2.02, 0.1, 1.22);
    const stripe = new THREE.Mesh(stripeGeo, accentMat);

    group.add(caseMesh, stripe);
  } else {
    // Sphere / Cube / General 3D Geometry
    const mainGeo = preset === 'cube' 
      ? new THREE.BoxGeometry(2, 2, 2) 
      : new THREE.IcosahedronGeometry(1.5, 2);
    
    const mesh = new THREE.Mesh(mainGeo, mainMat);

    const ringGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, accentMat);
    ringMesh.rotation.x = Math.PI / 3;

    group.add(mesh, ringMesh);
  }
}
