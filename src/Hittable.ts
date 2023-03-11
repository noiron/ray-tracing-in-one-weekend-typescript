import Vec3 from "./Vec3";
import Ray from "./Ray";
import Point3 from "./Point3";

export class HitRecord {
  point: Point3;
  normal: Vec3;
  t: number;
  frontFace: boolean;

  constructor(point: Point3, normal: Vec3, t: number) {
    this.point = point;
    this.normal = normal;
    this.t = t;
    this.frontFace = false;
  }

  setFaceNormal = (r: Ray, outwardNormal: Vec3) => {
    this.frontFace = r.direction.dot(outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : outwardNormal.negate();
  };
}

export default interface Hittable {
  hit(ray: Ray, tMin: number, tMax: number): HitRecord | null;
}
