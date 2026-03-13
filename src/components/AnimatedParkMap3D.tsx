import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';

/* ──────────────── Ferris Wheel ──────────────── */
function FerrisWheel({ position }: { position: [number, number, number] }) {
  const wheelGroupRef = useRef<THREE.Group>(null);
  const gondolaRefs = useRef<THREE.Group[]>([]);
  const numGondolas = 8;
  const wheelRadius = 2.2;

  useFrame((_, delta) => {
    if (wheelGroupRef.current) {
      wheelGroupRef.current.rotation.z += delta * 0.3;
    }
    // Counter-rotate gondolas so they stay upright
    gondolaRefs.current.forEach((g) => {
      if (g) g.rotation.z -= delta * 0.3;
    });
  });

  const gondolas = useMemo(() => {
    return Array.from({ length: numGondolas }, (_, i) => {
      const angle = (i / numGondolas) * Math.PI * 2;
      const x = Math.cos(angle) * wheelRadius;
      const y = Math.sin(angle) * wheelRadius;
      return { x, y, angle };
    });
  }, []);

  return (
    <group position={position}>
      {/* Support Legs */}
      <mesh position={[-0.6, 1.2, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.15, 3.6, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.6, 1.2, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.15, 3.6, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Cross brace */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 1.2, 0.08]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Base platform */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2, 0.2, 0.8]} />
        <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Rotating wheel group */}
      <group ref={wheelGroupRef} position={[0, 2.8, 0]}>
        {/* Outer rim */}
        <mesh>
          <torusGeometry args={[wheelRadius, 0.06, 8, 48]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Inner rim */}
        <mesh>
          <torusGeometry args={[wheelRadius * 0.55, 0.04, 8, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Spokes */}
        {Array.from({ length: numGondolas }).map((_, i) => {
          const angle = (i / numGondolas) * Math.PI * 2;
          return (
            <mesh key={`spoke-${i}`} rotation={[0, 0, angle]} position={[0, 0, 0]}>
              <boxGeometry args={[0.04, wheelRadius * 2, 0.04]} />
              <meshStandardMaterial color="#fde68a" metalness={0.5} roughness={0.3} />
            </mesh>
          );
        })}

        {/* Center hub */}
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
          <meshStandardMaterial color="#ef4444" metalness={0.4} roughness={0.3} />
        </mesh>

        {/* Gondolas */}
        {gondolas.map((g, i) => (
          <group
            key={`gondola-${i}`}
            ref={(el) => { if (el) gondolaRefs.current[i] = el; }}
            position={[g.x, g.y, 0]}
          >
            {/* Hanger wire */}
            <mesh position={[0, -0.15, 0]}>
              <boxGeometry args={[0.02, 0.3, 0.02]} />
              <meshStandardMaterial color="#94a3b8" />
            </mesh>
            {/* Gondola cabin */}
            <mesh position={[0, -0.45, 0]} castShadow>
              <boxGeometry args={[0.35, 0.3, 0.25]} />
              <meshStandardMaterial
                color={['#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#f97316'][i]}
                metalness={0.2}
                roughness={0.5}
              />
            </mesh>
            {/* Gondola roof */}
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.4, 0.05, 0.3]} />
              <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.5} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ──────────────── Roller Coaster ──────────────── */
function RollerCoaster({ position }: { position: [number, number, number] }) {
  const cartRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // CatmullRom curve for the track
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0.5, 0),
      new THREE.Vector3(-3.5, 0.5, 1),
      new THREE.Vector3(-2, 3.2, 0.5),
      new THREE.Vector3(-0.5, 1.0, -0.5),
      new THREE.Vector3(1, 2.8, 0),
      new THREE.Vector3(2.5, 0.8, 0.5),
      new THREE.Vector3(4, 2.2, -0.3),
      new THREE.Vector3(5, 0.5, 0),
      new THREE.Vector3(5.5, 0.5, 1),
    ], false, 'catmullrom', 0.5);
  }, []);

  // Track geometry from tube
  const tubeGeom = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.08, 8, false);
  }, [curve]);

  // Rail geometry (offset for double rail look)
  const railGeom = useMemo(() => {
    const rail1Points = [];
    const rail2Points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize().multiplyScalar(0.12);
      rail1Points.push(point.clone().add(right));
      rail2Points.push(point.clone().sub(right));
    }
    return {
      rail1: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(rail1Points), 80, 0.03, 6, false
      ),
      rail2: new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(rail2Points), 80, 0.03, 6, false
      ),
    };
  }, [curve]);

  // Support pillars
  const pillars = useMemo(() => {
    const pillarPositions: { x: number; y: number; z: number; height: number }[] = [];
    const pillarTs = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
    pillarTs.forEach(t => {
      const point = curve.getPointAt(t);
      pillarPositions.push({ x: point.x, y: point.y / 2, z: point.z, height: point.y });
    });
    return pillarPositions;
  }, [curve]);

  useFrame((_, delta) => {
    progressRef.current = (progressRef.current + delta * 0.08) % 1;
    if (cartRef.current) {
      const point = curve.getPointAt(progressRef.current);
      const tangent = curve.getTangentAt(progressRef.current);
      cartRef.current.position.set(point.x, point.y + 0.15, point.z);
      // Look in the direction of travel
      const lookAt = point.clone().add(tangent);
      cartRef.current.lookAt(lookAt);
    }
  });

  return (
    <group position={position}>
      {/* Main track tube (center) */}
      <mesh geometry={tubeGeom}>
        <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Rails */}
      <mesh geometry={railGeom.rail1}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.15} />
      </mesh>
      <mesh geometry={railGeom.rail2}>
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Support pillars */}
      {pillars.map((p, i) => (
        <mesh key={`pillar-${i}`} position={[p.x, p.y, p.z]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, p.height, 6]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Coaster Cart */}
      <mesh ref={cartRef} castShadow>
        <boxGeometry args={[0.5, 0.25, 0.3]} />
        <meshStandardMaterial color="#ef4444" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ──────────────── Tree ──────────────── */
function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 6]} />
        <meshStandardMaterial color="#92400e" roughness={0.8} />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <coneGeometry args={[0.45, 0.7, 8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.35, 0.6, 8]} />
        <meshStandardMaterial color="#22c55e" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[0.22, 0.45, 8]} />
        <meshStandardMaterial color="#4ade80" roughness={0.7} />
      </mesh>
    </group>
  );
}

/* ──────────────── Bush ──────────────── */
function Bush({ position, color = '#16a34a' }: { position: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.25, 8, 6]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

/* ──────────────── Entrance Gate ──────────────── */
function EntranceGate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-0.8, 0.8, 0]} castShadow>
        <boxGeometry args={[0.3, 1.6, 0.3]} />
        <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[0.8, 0.8, 0]} castShadow>
        <boxGeometry args={[0.3, 1.6, 0.3]} />
        <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[2, 0.35, 0.35]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1.6, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Stars on top */}
      <mesh position={[-0.5, 2.5, 0]}>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <octahedronGeometry args={[0.15]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.5, 2.5, 0]}>
        <octahedronGeometry args={[0.12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.1} emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/* ──────────────── Pathway ──────────────── */
function Pathway({ points }: { points: [number, number, number][] }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.15, 0);
    s.lineTo(0.15, 0);
    return s;
  }, []);

  const curvePath = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
  }, [points]);

  const extrudeGeom = useMemo(() => {
    return new THREE.ExtrudeGeometry(shape, {
      steps: 60,
      extrudePath: curvePath,
    });
  }, [shape, curvePath]);

  return (
    <mesh geometry={extrudeGeom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
      <meshStandardMaterial color="#d4a574" roughness={0.9} />
    </mesh>
  );
}

/* ──────────────── Terrain ──────────────── */
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(30, 30, 64, 64);
    const posAttr = geom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      // Gentle rolling hills
      const height = Math.sin(x * 0.3) * 0.15 + Math.cos(y * 0.4) * 0.12 + Math.sin((x + y) * 0.2) * 0.08;
      posAttr.setZ(i, height);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <meshStandardMaterial color="#4ade80" roughness={0.9} flatShading />
    </mesh>
  );
}

/* ──────────────── Floating Clouds ──────────────── */
function Cloud({ position, speed = 0.2 }: { position: [number, number, number]; speed?: number }) {
  const ref = useRef<THREE.Group>(null);
  const initialX = position[0];

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.x += delta * speed;
      if (ref.current.position.x > 15) {
        ref.current.position.x = -15;
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.6, 8, 6]} />
        <meshStandardMaterial color="white" roughness={1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]}>
        <sphereGeometry args={[0.45, 8, 6]} />
        <meshStandardMaterial color="white" roughness={1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.4, 0.05, 0.1]}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color="white" roughness={1} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.2, 0.2, -0.1]}>
        <sphereGeometry args={[0.35, 8, 6]} />
        <meshStandardMaterial color="white" roughness={1} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

/* ──────────────── Hot Air Balloon ──────────────── */
function HotAirBalloon({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.3;
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Balloon envelope */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <sphereGeometry args={[0.6, 12, 10]} />
        <meshStandardMaterial color="#f97316" roughness={0.6} />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <torusGeometry args={[0.55, 0.06, 6, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Basket ropes */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.25, 0.02, 0.5, 4]} />
        <meshStandardMaterial color="#92400e" wireframe />
      </mesh>
      {/* Basket */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.25, 0.18, 0.25]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
    </group>
  );
}

/* ──────────────── Food Stall ──────────────── */
function FoodStall({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Counter */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.8, 0.7, 0.5]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[1, 0.08, 0.7]} />
        <meshStandardMaterial color="#dc2626" metalness={0.2} roughness={0.5} />
      </mesh>
      {/* Roof stripes */}
      <mesh position={[0, 0.99, 0]}>
        <boxGeometry args={[1, 0.04, 0.72]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Pole left */}
      <mesh position={[-0.4, 0.7, 0.22]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} />
      </mesh>
      {/* Pole right */}
      <mesh position={[0.4, 0.7, 0.22]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} />
      </mesh>
    </group>
  );
}

/* ──────────────── Scene ──────────────── */
function ParkScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#fef9c3" />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        color="#fff7ed"
      />
      <hemisphereLight args={['#87ceeb', '#4ade80', 0.4]} />

      {/* Sky */}
      <Sky sunPosition={[100, 60, 100]} turbidity={2} rayleigh={0.5} />

      {/* Terrain */}
      <Terrain />

      {/* Ferris Wheel */}
      <FerrisWheel position={[-4, 0, -2]} />

      {/* Roller Coaster */}
      <RollerCoaster position={[3, 0, 1]} />

      {/* Entrance Gate */}
      <EntranceGate position={[0, 0, 6]} />

      {/* Hot Air Balloon */}
      <HotAirBalloon position={[5, 6, -3]} />

      {/* Food Stalls */}
      <FoodStall position={[-1.5, 0, 3]} />
      <FoodStall position={[1.5, 0, 3]} />

      {/* Trees */}
      <Tree position={[-7, 0, -5]} scale={0.9} />
      <Tree position={[-6, 0, 3]} scale={1.1} />
      <Tree position={[7, 0, -4]} scale={0.8} />
      <Tree position={[8, 0, 2]} scale={1.2} />
      <Tree position={[-3, 0, 5]} scale={0.7} />
      <Tree position={[5, 0, 5]} scale={1.0} />
      <Tree position={[-8, 0, 0]} scale={1.0} />
      <Tree position={[6, 0, -1]} scale={0.85} />

      {/* Bushes for detail */}
      <Bush position={[-2, 0.1, 4]} color="#16a34a" />
      <Bush position={[2, 0.1, 4.5]} color="#22c55e" />
      <Bush position={[-5, 0.1, 1]} color="#15803d" />
      <Bush position={[4, 0.1, -3]} color="#16a34a" />
      <Bush position={[0, 0.1, 5.5]} color="#22c55e" />

      {/* Pathways */}
      <Pathway points={[
        [0, 0.02, 6],
        [0, 0.02, 3],
        [-1, 0.02, 1],
        [-3.5, 0.02, -1],
        [-4, 0.02, -2],
      ]} />
      <Pathway points={[
        [0, 0.02, 3],
        [1, 0.02, 1.5],
        [3, 0.02, 1],
      ]} />

      {/* Clouds */}
      <Cloud position={[-5, 7, -4]} speed={0.15} />
      <Cloud position={[3, 8, -6]} speed={0.1} />
      <Cloud position={[-2, 9, -8]} speed={0.2} />

      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={6}
        maxDistance={22}
        autoRotate
        autoRotateSpeed={0.5}
        enablePan={true}
        panSpeed={0.5}
        target={[0, 1.5, 0]}
      />
    </>
  );
}

/* ──────────────── Main Export ──────────────── */
export default function AnimatedParkMap3D() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative mb-6 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 cursor-grab active:cursor-grabbing"
      style={{ height: 'clamp(200px, 30vw, 320px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        shadows
        camera={{ position: [12, 10, 12], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <ParkScene />
      </Canvas>

      {/* Overlay label */}
      <div
        className={`absolute bottom-2 left-4 text-[10px] md:text-xs font-bold text-white/90 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md shadow-inner pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
      >
        🎮 Drag to explore the 3D Park World
      </div>

      {/* Controls hint on hover */}
      <div
        className={`absolute top-2 right-3 text-[9px] md:text-[10px] font-medium text-white/80 bg-black/30 px-2 py-1 rounded-full backdrop-blur-md pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        🖱️ Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
