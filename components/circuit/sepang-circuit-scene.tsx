"use client";

import { useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { HOTSPOT_ORDER, type HotspotId } from "@/content/sepang";

const TRACK_POINTS = [
  new THREE.Vector3(-3.4, 0, 1.2),
  new THREE.Vector3(-4.1, 0, 2.2),
  new THREE.Vector3(-3.8, 0, 3.2),
  new THREE.Vector3(-2.4, 0, 3.6),
  new THREE.Vector3(-0.9, 0, 2.8),
  new THREE.Vector3(0.5, 0, 2.0),
  new THREE.Vector3(2.0, 0, 2.1),
  new THREE.Vector3(3.1, 0, 3.0),
  new THREE.Vector3(4.3, 0, 3.2),
  new THREE.Vector3(4.9, 0, 2.3),
  new THREE.Vector3(4.2, 0, 1.3),
  new THREE.Vector3(3.0, 0, 0.6),
  new THREE.Vector3(2.1, 0, -0.3),
  new THREE.Vector3(2.4, 0, -1.5),
  new THREE.Vector3(1.6, 0, -2.6),
  new THREE.Vector3(0.4, 0, -2.2),
  new THREE.Vector3(-0.1, 0, -1.0),
  new THREE.Vector3(-1.4, 0, -0.7),
  new THREE.Vector3(-2.7, 0, -1.4),
  new THREE.Vector3(-3.9, 0, -0.7),
] as const;

const TRACK_CURVE = new THREE.CatmullRomCurve3(
  [...TRACK_POINTS],
  true,
  "catmullrom",
  0.35,
);

const HOTSPOT_T: Record<HotspotId, number> = {
  "main-straight": 0.31,
  t1: 0.42,
  t4: 0.58,
  t9: 0.76,
  t15: 0.98,
};

const CAMERA_OFFSETS: Record<HotspotId, THREE.Vector3> = {
  "main-straight": new THREE.Vector3(3.8, 5.8, 4.2),
  t1: new THREE.Vector3(3.4, 5.2, 3.5),
  t4: new THREE.Vector3(3.1, 5.0, 3.6),
  t9: new THREE.Vector3(3.3, 5.1, 3.2),
  t15: new THREE.Vector3(3.5, 5.3, 3.4),
};

function sampleTrack(t: number) {
  const wrapped = ((t % 1) + 1) % 1;
  return TRACK_CURVE.getPointAt(wrapped);
}

function CameraRig({
  selectedHotspot,
  reduceMotion,
}: {
  selectedHotspot: HotspotId;
  reduceMotion: boolean;
}) {
  const { camera, invalidate } = useThree();
  const target = useMemo(
    () => sampleTrack(HOTSPOT_T[selectedHotspot]),
    [selectedHotspot],
  );
  const desiredCamera = useMemo(
    () => target.clone().add(CAMERA_OFFSETS[selectedHotspot]),
    [selectedHotspot, target],
  );

  useEffect(() => {
    if (reduceMotion) {
      camera.position.copy(desiredCamera);
      camera.lookAt(target);
    }
    invalidate();
  }, [camera, desiredCamera, invalidate, reduceMotion, target]);

  useFrame(() => {
    if (reduceMotion) {
      return;
    }

    camera.position.lerp(desiredCamera, 0.12);
    camera.lookAt(target);

    if (camera.position.distanceTo(desiredCamera) > 0.02) {
      invalidate();
    }
  });

  return null;
}

function CircuitModel({ selectedHotspot }: { selectedHotspot: HotspotId }) {
  const selectedSegment = useMemo(() => {
    const t = HOTSPOT_T[selectedHotspot];
    const points = [-0.045, -0.022, 0, 0.022, 0.045].map((offset) =>
      sampleTrack(t + offset),
    );

    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.3);
  }, [selectedHotspot]);

  return (
    <group>
      <mesh position={[0, -0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 12]} />
        <meshStandardMaterial color="#181820" roughness={1} />
      </mesh>

      <mesh>
        <tubeGeometry args={[TRACK_CURVE, 180, 0.18, 10, true]} />
        <meshStandardMaterial color="#34343d" roughness={0.88} metalness={0.06} />
      </mesh>

      <mesh position={[0, 0.015, 0]}>
        <tubeGeometry args={[TRACK_CURVE, 180, 0.045, 8, true]} />
        <meshStandardMaterial color="#777781" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.05, 0]}>
        <tubeGeometry args={[selectedSegment, 40, 0.205, 10, false]} />
        <meshStandardMaterial color="#E10600" roughness={0.7} />
      </mesh>

      {HOTSPOT_ORDER.map((hotspot) => {
        const position = sampleTrack(HOTSPOT_T[hotspot]);
        const selected = hotspot === selectedHotspot;

        return (
          <group key={hotspot} position={[position.x, 0.24, position.z]}>
            <mesh>
              <sphereGeometry args={[selected ? 0.19 : 0.13, 18, 18]} />
              <meshStandardMaterial color={selected ? "#E10600" : "#B7B7BF"} />
            </mesh>
            {selected ? (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.17, 0]}>
                <ringGeometry args={[0.28, 0.35, 28]} />
                <meshBasicMaterial color="#E10600" transparent opacity={0.7} />
              </mesh>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

export function SepangCircuitScene({
  selectedHotspot,
  reduceMotion = false,
}: {
  selectedHotspot: HotspotId;
  reduceMotion?: boolean;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [5, 6, 6], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#111118"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 8, 6]} intensity={2.2} />
      <directionalLight position={[-5, 3, -4]} intensity={0.7} />
      <CircuitModel selectedHotspot={selectedHotspot} />
      <CameraRig
        selectedHotspot={selectedHotspot}
        reduceMotion={reduceMotion}
      />
    </Canvas>
  );
}
