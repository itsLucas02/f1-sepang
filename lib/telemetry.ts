/**
 * Deterministic hot-lap telemetry model.
 *
 * This is a *derived visualisation*, not live data: a physics-lite speed profile
 * computed from the geometry of the circuit centreline. Given the same polyline
 * it always produces the same lap, which keeps the WebGL scene, the 2D fallback
 * map and the HUD readouts perfectly in sync (and unit-testable).
 */

export type TrackPoint = { x: number; z: number };

export type TelemetrySample = {
  /** Normalised lap progress, 0 at the start/finish line. */
  progress: number;
  /** Cumulative distance from the line, metres. */
  distance: number;
  /** Cumulative elapsed lap time, seconds. */
  time: number;
  /** Speed in km/h. */
  speed: number;
  /** Local path curvature, 1/m. */
  curvature: number;
  gear: number;
  /** 0–1 */
  throttle: number;
  /** 0–1 */
  brake: number;
};

export type TrackCorner = {
  /** Turn number in lap order, 1-based. */
  number: number;
  index: number;
  progress: number;
  /** Minimum speed through the corner, km/h. */
  apexSpeed: number;
  /** "left" or "right" hand corner. */
  direction: "left" | "right";
  /** Rough corner severity, 0–1. */
  severity: number;
};

export type HotLap = {
  points: readonly TrackPoint[];
  samples: readonly TelemetrySample[];
  corners: readonly TrackCorner[];
  /** Cumulative sector end times, seconds. */
  sectorTimes: readonly [number, number, number];
  /** Progress boundaries where each sector ends. */
  sectorBounds: readonly [number, number, number];
  lapTime: number;
  lapDistance: number;
  topSpeed: number;
  minSpeed: number;
  /** Share of the lap spent at full throttle, 0–1. */
  fullThrottleShare: number;
};

export type HotLapOptions = {
  /** Real circuit length in metres, used to scale the normalised polyline. */
  lapDistance?: number;
  /** Aerodynamic-assisted lateral grip, m/s². */
  lateralGrip?: number;
  /** Braking deceleration, m/s². */
  braking?: number;
  /** Traction-limited acceleration, m/s². */
  acceleration?: number;
  /** Top speed in km/h. */
  topSpeed?: number;
  /** Slowest speed the model allows, km/h. */
  minSpeed?: number;
  /** Curvature smoothing window (samples). */
  smoothing?: number;
};

const DEFAULTS: Required<HotLapOptions> = {
  lapDistance: 5543,
  lateralGrip: 25.4,
  braking: 46,
  acceleration: 12,
  topSpeed: 331,
  minSpeed: 62,
  smoothing: 7,
};

const KMH = 3.6;

export function toKmh(metresPerSecond: number) {
  return metresPerSecond * KMH;
}

export function toMs(kmh: number) {
  return kmh / KMH;
}

/** Gear model tuned to feel plausible for a modern 8-speed F1 gearbox. */
export function gearForSpeed(speedKmh: number) {
  if (speedKmh < 85) return 1;
  if (speedKmh < 125) return 2;
  if (speedKmh < 165) return 3;
  if (speedKmh < 205) return 4;
  if (speedKmh < 240) return 5;
  if (speedKmh < 272) return 6;
  if (speedKmh < 302) return 7;
  return 8;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

/** Menger curvature (1/radius) of the circle through three consecutive points. */
function mengerCurvature(a: TrackPoint, b: TrackPoint, c: TrackPoint) {
  const ab = Math.hypot(b.x - a.x, b.z - a.z);
  const bc = Math.hypot(c.x - b.x, c.z - b.z);
  const ca = Math.hypot(a.x - c.x, a.z - c.z);

  if (ab === 0 || bc === 0 || ca === 0) {
    return 0;
  }

  const area = Math.abs(
    (b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z),
  ) / 2;

  return (4 * area) / (ab * bc * ca);
}

/** Signed turn direction at a point: positive is a left-hand corner. */
function turnSign(a: TrackPoint, b: TrackPoint, c: TrackPoint) {
  return Math.sign((b.x - a.x) * (c.z - a.z) - (c.x - a.x) * (b.z - a.z));
}

function smoothLoop(values: number[], window: number) {
  if (window <= 1) {
    return [...values];
  }

  const half = Math.floor(window / 2);
  const length = values.length;

  return values.map((_, index) => {
    let total = 0;
    let weight = 0;

    for (let offset = -half; offset <= half; offset += 1) {
      const falloff = 1 - Math.abs(offset) / (half + 1);
      total += values[wrapIndex(index + offset, length)] * falloff;
      weight += falloff;
    }

    return total / weight;
  });
}

/**
 * Builds a closed-loop speed profile from a circuit centreline.
 *
 * The model is the classic three-pass approach used by lap-time simulators:
 * curvature -> cornering speed limit -> forward traction pass -> backward
 * braking pass. Two loops of each pass converge the closed circuit.
 */
export function buildHotLap(
  rawPoints: readonly (readonly [number, number])[] | readonly TrackPoint[],
  options: HotLapOptions = {},
): HotLap {
  const config = { ...DEFAULTS, ...options };

  const points: TrackPoint[] = (rawPoints as readonly unknown[]).map((point) =>
    Array.isArray(point)
      ? { x: point[0] as number, z: point[1] as number }
      : ({ ...(point as TrackPoint) }),
  );

  const count = points.length;

  if (count < 8) {
    throw new Error("A hot lap needs at least 8 track points");
  }

  // Segment lengths in normalised units, then rescaled so the lap matches the
  // real circuit distance.
  const rawSegments = points.map((point, index) => {
    const next = points[wrapIndex(index + 1, count)];
    return Math.hypot(next.x - point.x, next.z - point.z);
  });

  const rawLength = rawSegments.reduce((total, value) => total + value, 0);
  const unitScale = config.lapDistance / rawLength;
  const segments = rawSegments.map((value) => value * unitScale);

  const curvature = smoothLoop(
    points.map((point, index) => {
      const previous = points[wrapIndex(index - 3, count)];
      const next = points[wrapIndex(index + 3, count)];
      return mengerCurvature(previous, point, next) / unitScale;
    }),
    config.smoothing,
  );

  const vMax = toMs(config.topSpeed);
  const vMin = toMs(config.minSpeed);

  const limit = curvature.map((value) => {
    if (value <= 1e-6) {
      return vMax;
    }
    return Math.min(vMax, Math.max(vMin, Math.sqrt(config.lateralGrip / value)));
  });

  const speeds = [...limit];

  // Forward pass: you cannot accelerate harder than traction allows.
  for (let pass = 0; pass < 2; pass += 1) {
    for (let index = 0; index < count; index += 1) {
      const current = wrapIndex(index, count);
      const next = wrapIndex(index + 1, count);
      const reachable = Math.sqrt(
        speeds[current] ** 2 + 2 * config.acceleration * segments[current],
      );
      speeds[next] = Math.min(speeds[next], reachable);
    }
  }

  // Backward pass: you must already be slowing for the next corner.
  for (let pass = 0; pass < 2; pass += 1) {
    for (let index = count - 1; index >= 0; index -= 1) {
      const current = wrapIndex(index, count);
      const next = wrapIndex(index + 1, count);
      const reachable = Math.sqrt(
        speeds[next] ** 2 + 2 * config.braking * segments[current],
      );
      speeds[current] = Math.min(speeds[current], reachable);
    }
  }

  const samples: TelemetrySample[] = [];
  let distance = 0;
  let time = 0;

  for (let index = 0; index < count; index += 1) {
    const speed = speeds[index];
    const nextSpeed = speeds[wrapIndex(index + 1, count)];
    const segment = segments[index];
    const longitudinal =
      segment > 0 ? (nextSpeed ** 2 - speed ** 2) / (2 * segment) : 0;

    const brake =
      longitudinal < -0.4 ? Math.min(1, -longitudinal / config.braking) : 0;

    let throttle = 0;

    if (brake === 0) {
      if (speed >= vMax * 0.995) {
        // Flat out along a straight, engine limited.
        throttle = 1;
      } else if (longitudinal > 0.05) {
        // Feeding the power back in on corner exit.
        throttle = Math.min(1, 0.55 + longitudinal / config.acceleration);
      } else {
        // Maintenance throttle while grip limited through the apex.
        throttle = 0.28 + 0.34 * (speed / vMax);
      }
    }

    samples.push({
      progress: distance / config.lapDistance,
      distance,
      time,
      speed: toKmh(speed),
      curvature: curvature[index],
      gear: gearForSpeed(toKmh(speed)),
      throttle,
      brake,
    });

    const averageSpeed = Math.max((speed + nextSpeed) / 2, 1);
    time += segment / averageSpeed;
    distance += segment;
  }

  const lapTime = time;
  const speedList = samples.map((sample) => sample.speed);
  const topSpeed = Math.max(...speedList);
  const minSpeed = Math.min(...speedList);

  const sectorBounds: [number, number, number] = [1 / 3, 2 / 3, 1];
  const sectorTimes = sectorBounds.map((bound) => {
    if (bound >= 1) {
      return lapTime;
    }
    const sample = samples.find((candidate) => candidate.progress >= bound);
    return sample ? sample.time : lapTime;
  }) as unknown as [number, number, number];

  const fullThrottleSamples = samples.filter(
    (sample) => sample.throttle > 0.98,
  ).length;

  return {
    points,
    samples,
    corners: detectCorners(samples, points),
    sectorTimes,
    sectorBounds,
    lapTime,
    lapDistance: config.lapDistance,
    topSpeed,
    minSpeed,
    fullThrottleShare: fullThrottleSamples / count,
  };
}

/**
 * Finds the corners of the lap as local speed minima, in lap order.
 * A corner is a point that is slower than everything within `window` samples.
 */
export function detectCorners(
  samples: readonly TelemetrySample[],
  points: readonly TrackPoint[],
  { window = 8, threshold = 0.95 } = {},
): TrackCorner[] {
  const count = samples.length;
  const topSpeed = Math.max(...samples.map((sample) => sample.speed));
  const candidates: TrackCorner[] = [];

  for (let index = 0; index < count; index += 1) {
    const sample = samples[index];

    if (sample.speed > topSpeed * threshold) {
      continue;
    }

    let isMinimum = true;

    for (let offset = -window; offset <= window; offset += 1) {
      if (offset === 0) continue;
      const other = samples[wrapIndex(index + offset, count)];

      if (
        other.speed < sample.speed ||
        (other.speed === sample.speed && offset < 0)
      ) {
        isMinimum = false;
        break;
      }
    }

    if (!isMinimum) {
      continue;
    }

    const previous = points[wrapIndex(index - 4, count)];
    const next = points[wrapIndex(index + 4, count)];
    const sign = turnSign(previous, points[index], next);

    candidates.push({
      number: 0,
      index,
      progress: sample.progress,
      apexSpeed: sample.speed,
      direction: sign >= 0 ? "left" : "right",
      severity: Math.min(1, Math.max(0, 1 - sample.speed / topSpeed)),
    });
  }

  return candidates
    .sort((a, b) => a.progress - b.progress)
    .map((corner, index) => ({ ...corner, number: index + 1 }));
}

/** Interpolates a telemetry sample at an arbitrary lap time (seconds). */
export function sampleAtTime(lap: HotLap, seconds: number): TelemetrySample {
  const { samples, lapTime } = lap;
  const time = ((seconds % lapTime) + lapTime) % lapTime;

  let low = 0;
  let high = samples.length - 1;

  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (samples[mid].time <= time) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  const current = samples[low];
  const next = samples[(low + 1) % samples.length];
  const span =
    low + 1 === samples.length ? lapTime - current.time : next.time - current.time;
  const t = span > 0 ? (time - current.time) / span : 0;

  const nextProgress = low + 1 === samples.length ? 1 : next.progress;

  return {
    progress: current.progress + (nextProgress - current.progress) * t,
    distance: current.distance + (lap.lapDistance * (nextProgress - current.progress)) * t,
    time,
    speed: current.speed + (next.speed - current.speed) * t,
    curvature: current.curvature,
    gear: gearForSpeed(current.speed + (next.speed - current.speed) * t),
    throttle: current.throttle + (next.throttle - current.throttle) * t,
    brake: current.brake + (next.brake - current.brake) * t,
  };
}

/** Interpolates a telemetry sample at a normalised lap progress (0–1). */
export function sampleAtProgress(lap: HotLap, progress: number): TelemetrySample {
  const wrapped = ((progress % 1) + 1) % 1;
  const exact = wrapped * lap.samples.length;
  const low = Math.floor(exact) % lap.samples.length;
  const next = (low + 1) % lap.samples.length;
  const t = exact - Math.floor(exact);
  const current = lap.samples[low];
  const upcoming = lap.samples[next];
  const speed = current.speed + (upcoming.speed - current.speed) * t;

  return {
    progress: wrapped,
    distance: wrapped * lap.lapDistance,
    time: current.time,
    speed,
    curvature: current.curvature,
    gear: gearForSpeed(speed),
    throttle: current.throttle + (upcoming.throttle - current.throttle) * t,
    brake: current.brake + (upcoming.brake - current.brake) * t,
  };
}

/** Which sector (1–3) a lap progress value falls into. */
export function sectorForProgress(lap: HotLap, progress: number) {
  const wrapped = ((progress % 1) + 1) % 1;
  if (wrapped < lap.sectorBounds[0]) return 1;
  if (wrapped < lap.sectorBounds[1]) return 2;
  return 3;
}

/** Formats seconds as motorsport timing, e.g. 1:34.208. */
export function formatLapTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "--:--.---";
  }

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  const whole = Math.floor(remainder);
  const millis = Math.round((remainder - whole) * 1000);

  return `${minutes}:${String(whole).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

/** Formats a sector time, e.g. 31.482. */
export function formatSectorTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "--.---";
  }

  return seconds.toFixed(3);
}
