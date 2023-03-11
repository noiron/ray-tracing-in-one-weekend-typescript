import { random } from "./utils";

export default class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  negate = () => {
    return new Vec3(-this.x, -this.y, -this.z);
  };

  add = (v: Vec3) => {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  };

  subtract = (v: Vec3) => {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  };

  scale = (t: number) => {
    return new Vec3(this.x * t, this.y * t, this.z * t);
  };

  divide = (t: number) => {
    return this.scale(1 / t);
  };

  multiply = (v: Vec3) => {
    return new Vec3(this.x * v.x, this.y * v.y, this.z * v.z);
  };

  dot = (v: Vec3) => {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  cross = (v: Vec3) => {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  };

  lengthSquared = () => {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  };

  length = () => {
    return Math.sqrt(this.lengthSquared());
  };

  unit = () => {
    return this.divide(this.length());
  };

  nearZero = () => {
    const s = 1e-8;
    return Math.abs(this.x) < s && Math.abs(this.y) < s && Math.abs(this.z) < s;
  };

  static random = (min = 0, max = 1) => {
    return new Vec3(random(min, max), random(min, max), random(min, max));
  };
}

export function randomInUnitSphere() {
  while (true) {
    const p = Vec3.random(-1, 1);
    if (p.lengthSquared() >= 1) continue;
    return p;
  }
}

export function randomUnitVector() {
  return randomInUnitSphere().unit();
}

export function randomInHemisphere(normal: Vec3) {
  const inUnitSphere = randomInUnitSphere();
  if (inUnitSphere.dot(normal) > 0.0) {
    // In the same hemisphere as the normal
    return inUnitSphere;
  } else {
    return inUnitSphere.negate();
  }
}

export function reflect(v: Vec3, n: Vec3) {
  return v.subtract(n.scale(v.dot(n) * 2));
}

/** 折射 */
export function refract(unitVector: Vec3, n: Vec3, etaiOverEtat: number): Vec3 {
  const cosTheta = Math.min(unitVector.negate().dot(n), 1.0);
  const rOutPerp = unitVector.add(n.scale(cosTheta)).scale(etaiOverEtat);
  const rOutParallel = n.scale(
    -Math.sqrt(Math.abs(1.0 - rOutPerp.lengthSquared()))
  );

  return rOutPerp.add(rOutParallel);
}
