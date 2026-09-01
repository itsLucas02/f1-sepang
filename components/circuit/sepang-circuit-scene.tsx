"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

import { HOTSPOT_ORDER, type HotspotId } from "@/content/sepang";
import {
  SEPANG_HOTSPOT_PROGRESS,
  SEPANG_TRACK_SVG,
} from "@/lib/sepang-geometry";

type TrackData = {
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
};

function buildTrackData(): TrackData {
  const loader = new SVGLoader();
  const parsed = loader.parse(SEPANG_TRACK_SVG);
  const svgPoints = parsed.paths.flatMap((path) =>
    path.subPaths.flatMap((subPath) => subPath.getSpacedPoints(520)),
  );

  const bounds = new THREE.Box2().setFromPoints(svgPoints);
  const center = bounds.getCenter(new THREE.Vector2());
  const size = bounds.getSize(new THREE.Vector2());
  const scale = 10.4 / Math.max(size.x, size.y);

  const points = svgPoints.map(
    (point) =>
      new THREE.Vector3(
        (point.x - center.x) * scale,
        0,
        -(point.y - center.y) * scale,
      ),
  );

  if (points.length > 1 && points[0].distanceTo(points.at(-1)!) < 0.02) {
    points.pop();
  }

  return {
    points,
    curve: new THREE.CatmullRomCurve3(points, true, "centripetal", 0.08),
  };
}

function makeCameraPose(curve: THREE.CatmullRomCurve3, hotspot: HotspotId) {
  const t = SEPANG_HOTSPOT_PROGRESS[hotspot];
  const target = curve.getPointAt(t);
  const tangent = curve.getTangentAt(t).normalize();
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
  const isStraight = hotspot === "main-straight";

  const position = target
    .clone()
    .add(normal.multiplyScalar(isStraight ? 3.1 : 2.35))
    .add(tangent.multiplyScalar(isStraight ? -1.2 : -0.85))
    .add(new THREE.Vector3(0, isStraight ? 5.4 : 4.25, 0));

  return { position, target };
}

function CameraRig({
  curve,
  selectedHotspot,
  reduceMotion,
}: {
  curve: THREE.CatmullRomCurve3;
  selectedHotspot: HotspotId;
  reduceMotion: boolean;
}) {
  const { camera, invalidate } = useThree();
  const currentTarget = useRef(new THREE.Vector3());
  const fromPosition = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toPosition = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const startedAt = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    const next = makeCameraPose(curve, selectedHotspot);

    if (reduceMotion) {
      camera.position.copy(next.position);
      currentTarget.current.copy(next.target);
      camera.lookAt(next.target);
      invalidate();
      return;
    }

    fromPosition.current.copy(camera.position);
    fromTarget.current.copy(currentTarget.current);
    toPosition.current.copy(next.position);
    toTarget.current.copy(next.target);
    startedAt.current = performance.now();
    animating.current = true;
    invalidate();
  }, [camera, curve, invalidate, reduceMotion, selectedHotspot]);

  useFrame(() => {
    if (!animating.current) {
      return;
    }

    const raw = Math.min((performance.now() - startedAt.current) / 760, 1);
    const eased = raw < 0.5
      ? 4 * raw * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 3) / 2;

    camera.position.lerpVectors(
      fromPosition.current,
      toPosition.current,
      eased,
    );
    currentTarget.current.lerpVectors(
      fromTarget.current,
      toTarget.current,
      eased,
    );
    camera.lookAt(currentTarget.current);

    if (raw < 1) {
      invalidate();
    } else {
      animating.current = false;
    }
  });

  return null;
}

function SegmentFocus({
  curve,
  selectedHotspot,
}: {
  curve: THREE.CatmullRomCurve3;
  selectedHotspot: HotspotId;
}) {
  const { invalidate } = useThree();
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const sweepMarker = useRef<THREE.Mesh>(null);
  const startedAt = useRef(0);
  const animating = useRef(true);

  const segment = useMemo(() => {
    const center = SEPANG_HOTSPOT_PROGRESS[selectedHotspot];
    const samples = Array.from({ length: 18 }, (_, index) => {
      const offset = (index / 17 - 0.5) * 0.07;
      const t = (center + offset + 1) % 1;
      return curve.getPointAt(t);
    });

    return new THREE.CatmullRomCurve3(samples, false, "centripetal", 0.06);
  }, [curve, selectedHotspot]);

  useEffect(() => {
    startedAt.current = performance.now();
    animating.current = true;
    if (material.current) {
      material.current.opacity = 0;
    }
    invalidate();
  }, [invalidate, selectedHotspot]);

  useFrame(() => {
    if (!animating.current) {
      return;
    }

    const progress = Math.min((performance.now() - startedAt.current) / 620, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    if (material.current) {
      material.current.opacity = eased;
    }
    if (sweepMarker.current) {
      sweepMarker.current.position.copy(segment.getPointAt(eased));
    }

    if (progress < 1) {
      invalidate();
    } else {
      animating.current = false;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.055, 0]}>
        <tubeGeometry args={[segment, 72, 0.19, 12, false]} />
        <meshStandardMaterial
          ref={material}
          color="#E10600"
          emissive="#4a0200"
          emissiveIntensity={0.35}
          roughness={0.58}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh ref={sweepMarker} position={segment.getPointAt(0)}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#E10600"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function CircuitModel({
  curve,
  selectedHotspot,
}: {
  curve: THREE.CatmullRomCurve3;
  selectedHotspot: HotspotId;
}) {
  const mainStraight = curve.getPointAt(SEPANG_HOTSPOT_PROGRESS["main-straight"]);
  const tangent = curve
    .getTangentAt(SEPANG_HOTSPOT_PROGRESS["main-straight"])
    .normalize();
  const gridRotation = -Math.atan2(tangent.z, tangent.x);

  return (
    <group rotation={[0, -0.12, 0]}>
      <mesh position={[0, -0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial color="#101016" roughness={1} />
      </mesh>

      <gridHelper
        args={[22, 22, "#292932", "#1b1b23"]}
        position={[0, -0.175, 0]}
      />

      <mesh position={[0, -0.035, 0]}>
        <tubeGeometry args={[curve, 720, 0.205, 12, true]} />
        <meshStandardMaterial color="#24242c" roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.018, 0]}>
        <tubeGeometry args={[curve, 720, 0.125, 12, true]} />
        <meshStandardMaterial color="#55555f" roughness={0.78} metalness={0.06} />
      </mesh>

      <SegmentFocus curve={curve} selectedHotspot={selectedHotspot} />

      <group position={[mainStraight.x, 0.09, mainStraight.z]} rotation={[0, gridRotation, 0]}>
        {[-0.16, -0.05, 0.06, 0.17].map((offset) => (
          <mesh key={offset} position={[offset, 0, 0]}>
            <boxGeometry args={[0.035, 0.025, 0.42]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        ))}
      </group>

      {HOTSPOT_ORDER.map((hotspot) => {
        const position = curve.getPointAt(SEPANG_HOTSPOT_PROGRESS[hotspot]);
        const selected = hotspot === selectedHotspot;

        return (
          <group key={hotspot} position={[position.x, 0.22, position.z]}>
            <mesh>
              <sphereGeometry args={[selected ? 0.145 : 0.09, 20, 20]} />
              <meshStandardMaterial
                color={selected ? "#E10600" : "#D8D8DD"}
                emissive={selected ? "#380000" : "#000000"}
                emissiveIntensity={selected ? 0.45 : 0}
                roughness={0.55}
              />
            </mesh>
            {selected ? (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
                <ringGeometry args={[0.23, 0.285, 36]} />
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
  const trackData = useMemo(() => buildTrackData(), []);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.6]}
      camera={{ position: [7.2, 7, 7.2], fov: 38, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#0E0E14"]} />
      <fog attach="fog" args={["#0E0E14", 12, 24]} />
      <hemisphereLight args={["#FFFFFF", "#111118", 1.25]} />
      <directionalLight position={[5, 9, 5]} intensity={2.8} />
      <directionalLight position={[-6, 3, -5]} intensity={0.65} />

      <CircuitModel
        curve={trackData.curve}
        selectedHotspot={selectedHotspot}
      />
      <CameraRig
        curve={trackData.curve}
        selectedHotspot={selectedHotspot}
        reduceMotion={reduceMotion}
      />
    </Canvas>
  );
}
