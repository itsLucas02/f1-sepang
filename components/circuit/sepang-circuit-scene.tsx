"use client";

import { useEffect, useMemo, useRef } from "react";
import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { HOTSPOT_ORDER, getHotspot, type HotspotId } from "@/content/sepang";
import { SEPANG_HOTSPOT_PROGRESS } from "@/lib/sepang-geometry";
import {
  createApron,
  createAsphalt,
  createChequeredTexture,
  createEdgeLine,
  createKerbs,
  createSlabWall,
  createSpeedTrace,
  cornerPose as cornerPoseAt,
  directionAtProgress,
  positionAtProgress,
  SLAB_HEIGHT,
  TRACK_WIDTH,
} from "@/lib/circuit-geometry";
import { SEPANG_HOT_LAP, SEPANG_SECTOR_COLORS } from "@/lib/sepang-telemetry";
import { sampleAtTime } from "@/lib/telemetry";
import type { HotLapCamera } from "@/lib/use-hot-lap";

const TRAIL_SEGMENTS = 44;
const TRAIL_SPAN = 0.055;

function TrackSurface() {
  const geometries = useMemo(
    () => ({
      apron: createApron(),
      asphalt: createAsphalt(),
      wallLeft: createSlabWall(1),
      wallRight: createSlabWall(-1),
      edgeLeft: createEdgeLine(1),
      edgeRight: createEdgeLine(-1),
      kerbLeft: createKerbs(1),
      kerbRight: createKerbs(-1),
      trace: createSpeedTrace(),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
    },
    [geometries],
  );

  return (
    <group>
      {/* ground apron the slab sits on */}
      <mesh geometry={geometries.apron}>
        <meshBasicMaterial color="#0c0f14" />
      </mesh>

      {/* slab sides give the circuit real thickness */}
      <mesh geometry={geometries.wallLeft}>
        <meshStandardMaterial color="#0f1218" roughness={1} />
      </mesh>
      <mesh geometry={geometries.wallRight}>
        <meshStandardMaterial color="#0f1218" roughness={1} />
      </mesh>

      {/* asphalt */}
      <mesh geometry={geometries.asphalt}>
        <meshStandardMaterial color="#242832" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* painted edges */}
      <mesh geometry={geometries.edgeLeft}>
        <meshBasicMaterial color="#e9e7e1" transparent opacity={0.72} />
      </mesh>
      <mesh geometry={geometries.edgeRight}>
        <meshBasicMaterial color="#e9e7e1" transparent opacity={0.72} />
      </mesh>

      {/* kerbing on the corners */}
      <mesh geometry={geometries.kerbLeft}>
        <meshBasicMaterial vertexColors />
      </mesh>
      <mesh geometry={geometries.kerbRight}>
        <meshBasicMaterial vertexColors />
      </mesh>

      {/* speed-coloured racing line */}
      <mesh geometry={geometries.trace}>
        <meshBasicMaterial vertexColors transparent opacity={0.95} depthWrite={false} />
      </mesh>
    </group>
  );
}

function StartLine() {
  const texture = useMemo(() => createChequeredTexture(), []);
  const { position, rotation } = useMemo(() => {
    const point = positionAtProgress(0);
    const direction = directionAtProgress(0);
    return {
      position: [point.x, SLAB_HEIGHT + 0.006, point.z] as const,
      rotation: [-Math.PI / 2, 0, -Math.atan2(direction.z, direction.x)] as const,
    };
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.14, TRACK_WIDTH]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function SectorMarkers() {
  const markers = useMemo(
    () =>
      SEPANG_HOT_LAP.sectorBounds.map((bound, index) => {
        const progress = index === 2 ? 0.0005 : bound;
        const point = positionAtProgress(progress);
        const direction = directionAtProgress(progress);
        return {
          key: `sector-${index}`,
          color: SEPANG_SECTOR_COLORS[index],
          position: [point.x, SLAB_HEIGHT + 0.008, point.z] as const,
          rotation: [-Math.PI / 2, 0, -Math.atan2(direction.z, direction.x)] as const,
        };
      }),
    [],
  );

  return (
    <group>
      {markers.map((marker) => (
        <mesh key={marker.key} position={marker.position} rotation={marker.rotation}>
          <planeGeometry args={[0.03, TRACK_WIDTH + 0.16]} />
          <meshBasicMaterial color={marker.color} transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
}

function CornerDots() {
  const dots = useMemo(
    () =>
      SEPANG_HOT_LAP.corners.map((corner) => {
        const point = positionAtProgress(corner.progress);
        return {
          key: `corner-${corner.number}`,
          position: [point.x, SLAB_HEIGHT + 0.01, point.z] as const,
          radius: 0.026 + corner.severity * 0.016,
        };
      }),
    [],
  );

  return (
    <group>
      {dots.map((dot) => (
        <mesh key={dot.key} position={dot.position} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[dot.radius, 16]} />
          <meshBasicMaterial color="#f2f1ed" transparent opacity={0.36} />
        </mesh>
      ))}
    </group>
  );
}

function HotspotMarkers({
  selectedHotspot,
  onSelect,
}: {
  selectedHotspot: HotspotId;
  onSelect?: (hotspot: HotspotId) => void;
}) {
  const pulse = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();

  const markers = useMemo(
    () =>
      HOTSPOT_ORDER.map((id) => {
        const point = positionAtProgress(SEPANG_HOTSPOT_PROGRESS[id]);
        return { id, hotspot: getHotspot(id), position: point.clone() };
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!pulse.current) {
      return;
    }

    const t = (clock.getElapsedTime() % 1.6) / 1.6;
    const scale = 0.6 + t * 1.5;
    pulse.current.scale.setScalar(scale);
    const material = pulse.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.55 * (1 - t);
    invalidate();
  });

  return (
    <group>
      {markers.map((marker) => {
        const isSelected = marker.id === selectedHotspot;

        return (
          <group key={marker.id} position={[marker.position.x, SLAB_HEIGHT + 0.014, marker.position.z]}>
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(marker.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "";
              }}
            >
              <circleGeometry args={[0.075, 24]} />
              <meshBasicMaterial
                color={isSelected ? "#E8112D" : "#0b0c0f"}
                transparent
                opacity={isSelected ? 1 : 0.9}
              />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <ringGeometry args={[0.075, 0.095, 28]} />
              <meshBasicMaterial color={isSelected ? "#ffffff" : "#8f97a4"} />
            </mesh>

            {isSelected ? (
              <mesh ref={pulse} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
                <ringGeometry args={[0.085, 0.115, 30]} />
                <meshBasicMaterial color="#E8112D" transparent opacity={0.4} />
              </mesh>
            ) : null}

            <Html
              position={[0, 0.2, 0]}
              center
              distanceFactor={9}
              zIndexRange={[24, 0]}
              wrapperClass="pointer-events-none"
            >
              <span
                className={
                  isSelected
                    ? "scene-label scene-label-active"
                    : "scene-label"
                }
              >
                {marker.hotspot.shortLabel}
              </span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function RaceCar({ carRef }: { carRef: React.RefObject<THREE.Group | null> }) {
  return (
    <group ref={carRef}>
      <group scale={[1, 1, 1]}>
        {/* floor shadow / presence */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <circleGeometry args={[0.13, 20]} />
          <meshBasicMaterial color="#E8112D" transparent opacity={0.22} depthWrite={false} />
        </mesh>

        {/* chassis */}
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[0.045, 0.026, 0.17]} />
          <meshStandardMaterial
            color="#E8112D"
            emissive="#5c0410"
            emissiveIntensity={0.6}
            roughness={0.34}
            metalness={0.32}
          />
        </mesh>

        {/* nose */}
        <mesh position={[0, 0.022, 0.115]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.021, 0.09, 12]} />
          <meshStandardMaterial color="#f4f3ef" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* engine cover */}
        <mesh position={[0, 0.045, -0.03]}>
          <boxGeometry args={[0.026, 0.022, 0.08]} />
          <meshStandardMaterial color="#101216" roughness={0.5} />
        </mesh>

        {/* front wing */}
        <mesh position={[0, 0.012, 0.155]}>
          <boxGeometry args={[0.1, 0.006, 0.026]} />
          <meshStandardMaterial color="#f4f3ef" roughness={0.45} />
        </mesh>

        {/* rear wing */}
        <mesh position={[0, 0.055, -0.086]}>
          <boxGeometry args={[0.086, 0.03, 0.008]} />
          <meshStandardMaterial
            color="#E8112D"
            emissive="#3d030b"
            emissiveIntensity={0.8}
            roughness={0.4}
          />
        </mesh>

        {/* wheels */}
        {[
          [0.052, 0.019, 0.095],
          [-0.052, 0.019, 0.095],
          [0.056, 0.021, -0.062],
          [-0.056, 0.021, -0.062],
        ].map(([x, y, z]) => (
          <mesh key={`${x}-${z}`} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.021, 0.021, 0.018, 14]} />
            <meshStandardMaterial color="#0b0c0e" roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function SpeedTrail({ progressRef }: { progressRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const vertexCount = (TRAIL_SEGMENTS + 1) * 2;
    const positions = new Float32Array(vertexCount * 3);
    const colors = new Float32Array(vertexCount * 4);

    for (let index = 0; index <= TRAIL_SEGMENTS; index += 1) {
      const fade = 1 - index / TRAIL_SEGMENTS;
      const offset = index * 8;
      const tint = [1, 0.92, 0.86];

      for (let side = 0; side < 2; side += 1) {
        colors[offset + side * 4] = tint[0];
        colors[offset + side * 4 + 1] = tint[1];
        colors[offset + side * 4 + 2] = tint[2];
        colors[offset + side * 4 + 3] = fade * fade * 0.85;
      }
    }

    const indices: number[] = [];
    for (let index = 0; index < TRAIL_SEGMENTS; index += 1) {
      const base = index * 2;
      indices.push(base, base + 1, base + 3, base, base + 3, base + 2);
    }

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.BufferAttribute(colors, 4));
    buffer.setIndex(indices);
    return buffer;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;
    const head = progressRef.current;
    const point = new THREE.Vector3();
    const direction = new THREE.Vector3();

    for (let index = 0; index <= TRAIL_SEGMENTS; index += 1) {
      const t = index / TRAIL_SEGMENTS;
      const progress = head - t * TRAIL_SPAN;
      positionAtProgress(progress, point);
      directionAtProgress(progress, direction);

      const halfWidth = (0.03 * (1 - t)) + 0.004;
      const nx = -direction.z * halfWidth;
      const nz = direction.x * halfWidth;
      const offset = index * 6;

      array[offset] = point.x + nx;
      array[offset + 1] = SLAB_HEIGHT + 0.012;
      array[offset + 2] = point.z + nz;
      array[offset + 3] = point.x - nx;
      array[offset + 4] = SLAB_HEIGHT + 0.012;
      array[offset + 5] = point.z - nz;
    }

    attribute.needsUpdate = true;
    geometry.computeBoundingSphere();
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function HotLapRunner({
  timeRef,
  progressRef,
  playing,
  seekVersion,
}: {
  timeRef: React.RefObject<number>;
  progressRef: React.RefObject<number>;
  playing: boolean;
  seekVersion: number;
}) {
  const carRef = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const position = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const roll = useRef(0);

  const syncCar = () => {
    const sample = sampleAtTime(SEPANG_HOT_LAP, timeRef.current);
    progressRef.current = sample.progress;

    if (!carRef.current) {
      return;
    }

    positionAtProgress(sample.progress, position.current);
    directionAtProgress(sample.progress, direction.current);

    carRef.current.position.set(position.current.x, SLAB_HEIGHT, position.current.z);
    carRef.current.rotation.y = Math.atan2(direction.current.x, direction.current.z);

    const targetRoll =
      Math.min(0.22, sample.curvature * 6.5) * (sample.speed / SEPANG_HOT_LAP.topSpeed);
    roll.current += (targetRoll - roll.current) * 0.15;
    carRef.current.rotation.z = -roll.current;
  };

  useEffect(() => {
    syncCar();
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seekVersion, invalidate]);

  useFrame(() => {
    syncCar();
    if (playing) {
      invalidate();
    }
  });

  return (
    <group>
      <SpeedTrail progressRef={progressRef} />
      <RaceCar carRef={carRef} />
    </group>
  );
}

const OVERVIEW_POSITION = new THREE.Vector3(0, 13, 9.9);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0.35);

function cornerPose(hotspot: HotspotId) {
  return cornerPoseAt(SEPANG_HOTSPOT_PROGRESS[hotspot]);
}

function CameraRig({
  cameraMode,
  selectedHotspot,
  progressRef,
  reduceMotion,
  playing,
}: {
  cameraMode: HotLapCamera;
  selectedHotspot: HotspotId;
  progressRef: React.RefObject<number>;
  reduceMotion: boolean;
  playing: boolean;
}) {
  const { camera, invalidate } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const target = useRef(new THREE.Vector3());
  const from = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const to = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const startedAt = useRef(0);
  const tweening = useRef(false);
  const chaseReady = useRef(false);
  const chasePosition = useRef(new THREE.Vector3());
  const chaseTarget = useRef(new THREE.Vector3());
  const scratch = useRef(new THREE.Vector3());
  const scratchDirection = useRef(new THREE.Vector3());

  useEffect(() => {
    const pose =
      cameraMode === "corner"
        ? cornerPose(selectedHotspot)
        : { position: OVERVIEW_POSITION.clone(), target: OVERVIEW_TARGET.clone() };

    if (cameraMode === "chase") {
      tweening.current = false;
      chaseReady.current = false;
      invalidate();
      return;
    }

    if (reduceMotion) {
      camera.position.copy(pose.position);
      target.current.copy(pose.target);
      camera.lookAt(pose.target);
      controls.current?.target.copy(pose.target);
      invalidate();
      return;
    }

    from.current.copy(camera.position);
    fromTarget.current.copy(target.current);
    to.current.copy(pose.position);
    toTarget.current.copy(pose.target);
    startedAt.current = performance.now();
    tweening.current = true;
    invalidate();
  }, [camera, cameraMode, invalidate, reduceMotion, selectedHotspot]);

  useFrame(() => {
    const orbit = controls.current;

    if (cameraMode === "chase") {
      if (orbit) orbit.enabled = false;

      const progress = progressRef.current;
      positionAtProgress(progress, scratch.current);
      directionAtProgress(progress, scratchDirection.current);

      const desired = scratch.current
        .clone()
        .addScaledVector(scratchDirection.current, -0.62)
        .add(new THREE.Vector3(0, SLAB_HEIGHT + 0.3, 0));
      const lookAt = scratch.current
        .clone()
        .addScaledVector(scratchDirection.current, 0.5)
        .add(new THREE.Vector3(0, SLAB_HEIGHT + 0.04, 0));

      if (!chaseReady.current) {
        chasePosition.current.copy(desired);
        chaseTarget.current.copy(lookAt);
        chaseReady.current = true;
      } else {
        const ease = reduceMotion ? 1 : 0.12;
        chasePosition.current.lerp(desired, ease);
        chaseTarget.current.lerp(lookAt, ease);
      }

      camera.position.copy(chasePosition.current);
      camera.lookAt(chaseTarget.current);
      target.current.copy(chaseTarget.current);

      if (playing) invalidate();
      return;
    }

    if (tweening.current) {
      if (orbit) orbit.enabled = false;

      const raw = Math.min((performance.now() - startedAt.current) / 950, 1);
      const eased =
        raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      camera.position.lerpVectors(from.current, to.current, eased);
      target.current.lerpVectors(fromTarget.current, toTarget.current, eased);
      camera.lookAt(target.current);
      orbit?.target.copy(target.current);

      if (raw < 1) {
        invalidate();
      } else {
        tweening.current = false;
        if (orbit && cameraMode === "trackside") {
          orbit.enabled = true;
        }
      }
      return;
    }

    if (orbit) {
      orbit.enabled = cameraMode === "trackside";
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
      minDistance={2.4}
      maxDistance={18}
      minPolarAngle={0.18}
      maxPolarAngle={1.32}
    />
  );
}

export type SepangCircuitSceneProps = {
  selectedHotspot: HotspotId;
  cameraMode: HotLapCamera;
  timeRef: React.RefObject<number>;
  playing: boolean;
  seekVersion: number;
  reduceMotion?: boolean;
  onSelectHotspot?: (hotspot: HotspotId) => void;
};

export default function SepangCircuitScene({
  selectedHotspot,
  cameraMode,
  timeRef,
  playing,
  seekVersion,
  reduceMotion = false,
  onSelectHotspot,
}: SepangCircuitSceneProps) {
  const progressRef = useRef(0);

  return (
    <Canvas
      frameloop={playing || cameraMode === "chase" ? "always" : "demand"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 13, 9.9], fov: 34, near: 0.05, far: 160 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#07080a"]} />
      <fog attach="fog" args={["#07080a", 26, 70]} />

      <ambientLight intensity={0.85} />
      <hemisphereLight args={["#3d4757", "#08090c", 0.7]} />
      <directionalLight position={[4, 8, 5]} intensity={1.15} color="#fff3e6" />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#4d6b8f" />

      <gridHelper
        args={[60, 60, "#171b22", "#0f1217"]}
        position={[0, -0.05, 0]}
      />

      <TrackSurface />
      <StartLine />
      <SectorMarkers />
      <CornerDots />
      <HotspotMarkers selectedHotspot={selectedHotspot} onSelect={onSelectHotspot} />
      <HotLapRunner
        timeRef={timeRef}
        progressRef={progressRef}
        playing={playing}
        seekVersion={seekVersion}
      />

      <CameraRig
        cameraMode={cameraMode}
        selectedHotspot={selectedHotspot}
        progressRef={progressRef}
        reduceMotion={reduceMotion}
        playing={playing}
      />
    </Canvas>
  );
}
