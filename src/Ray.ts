import Vec3 from "./Vec3";
import Point3 from "./Point3";

export default class Ray {
  origin: Point3;
  direction: Vec3;

  constructor(origin: Point3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  at = (t: number) => {
    return this.origin.add(this.direction.scale(t));
  };
}
