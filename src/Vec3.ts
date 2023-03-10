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
}