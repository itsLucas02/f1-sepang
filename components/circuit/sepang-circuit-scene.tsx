"use client";

import { useEffect, useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
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
    path.subPaths.flatMap((subPath) => subPath.getSpacedPoints(760)),
  );

  const bounds = new THREE.Box2().setFromPoints(svgPoints);
  const center = bounds.getCenter(new THREE.Vector2());
  const size = bounds.getSize(new THREE.Vector2());
  const scale = 10.25 / Math.max(size.x, size.y);

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

  const curve = new THREE.CatmullRomCurve3(points, true, "centripetal", 0.05);

  return {
    curve,
    points: curve.getSpacedPoints(900),
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
    .add(normal.multiplyScalar(isStraight ? 1.35 : 1.65))
    .add(tangent.multiplyScalar(isStraight ? -0.65 : -0.35))
    .add(new THREE.Vector3(0, isStraight ? 7.2 : 6.35, isStraight ? 3.1 : 2.15));

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

    const raw = Math.min((performance.now() - startedAt.current) / 880, 1);
    const eased = raw < 0.5
      ? 4 * raw * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 3) / 2;

    camera.position.lerpVectors(fromPosition.current, toPosition.current, eased);
    currentTarget.current.lerpVectors(fromTarget.current, toTarget.current, eased);
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
  const sweepMarker = useRef<THREE.Mesh>(null);
  const startedAt = useRef(0);
  const animating = useRef(true);

  const points = useMemo(() => {
    const center = SEPANG_HOTSPOT_PROGRESS[selectedHotspot];
    return Array.from({ length: 42 }, (_, index) => {
      const offset = (index / 41 - 0.5) * 0.075;
      return curve.getPointAt((center + offset + 1) % 1);
    });
  }, [curve, selectedHotspot]);

  const sweepCurve = useMemo(
    () => new THREE.CatmullRomCurve3(points, false, "centripetal", 0.04),
    [points],
  );

  useEffect(() => {
    startedAt.current = performance.now();
    animating.current = true;
    if (sweepMarker.current) {
      sweepMarker.current.visible = true;
      sweepMarker.current.position.copy(sweepCurve.getPointAt(0));
    }
    invalidate();
  }, [invalidate, selectedHotspot, sweepCurve]);

  useFrame(() => {
    if (!animating.current || !sweepMarker.current) {
      return;
    }

    const progress = Math.min((performance.now() - startedAt.current) / 720, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    sweepMarker.current.position.copy(sweepCurve.getPointAt(eased));

    if (progress < 1) {
      invalidate();
    } else {
      sweepMarker.current.visible = false;
      animating.current = false;
    }
  });

  return (
    <group position={[0, 0.035, 0]}>
      <Line
        points={points}
        color="#E10600"
        lineWidth={9}
        transparent
        opacity={0.98}
      />
      <mesh ref={sweepMarker} position={sweepCurve.getPointAt(0)}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

function CircuitModel({
  curve,
  points,
  selectedHotspot,
}: {
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
  selectedHotspot: HotspotId;
}) {
  const closedPoints = useMemo(() => [...points, points[0]], [points]);
  const selectedPoint = curve.getPointAt(SEPANG_HOTSPOT_PROGRESS[selectedHotspot]);

  return (
    <group rotation={[0, -0.08, 0]}>
      <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshBasicMaterial color="#09090B" />
      </mesh>

      <group position={[0, 0.01, 0]}>
        <Line
          points={closedPoints}
          color="#000000"
          lineWidth={15}
          transparent
          opacity={0.5}
        />
        <Line points={closedPoints} color="#F2F1ED" lineWidth={11} />
        <Line points={closedPoints} color="#141416" lineWidth={7.2} />
      </group>

      <SegmentFocus curve={curve} selectedHotspot={selectedHotspot} />

      {HOTSPOT_ORDER.filter((hotspot) => hotspot !== selectedHotspot).map((hotspot) => {
        const point = curve.getPointAt(SEPANG_HOTSPOT_PROGRESS[hotspot]);
        return (
          <mesh
            key={hotspot}
            position={[point.x, 0.045, point.z]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[0.035, 18]} />
            <meshBasicMaterial color="#F2F1ED" transparent opacity={0.6} />
          </mesh>
        );
      })}

      <group position={[selectedPoint.x, 0.055, selectedPoint.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.205, 42]} />
          <meshBasicMaterial color="#E10600" transparent opacity={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
          <circleGeometry args={[0.065, 28]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </group>
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
      camera={{ position: [0, 8.8, 7.4], fov: 36, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#09090B"]} />
      <CircuitModel
        curve={trackData.curve}
        points={trackData.points}
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
