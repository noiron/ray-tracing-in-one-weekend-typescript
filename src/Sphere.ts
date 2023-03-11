import Ray from "./Ray";
import Hittable, { HitRecord } from "./Hittable";
import Point3 from "./Point3";
import { Material } from "./Material";

export default class Sphere implements Hittable {
  center: Point3;
  radius: number;
  material: Material;

  constructor(center: Point3, radius: number, material: Material) {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  hit(ray: Ray, tMin: number, tMax: number): HitRecord | null {
    const oc = ray.origin.subtract(this.center);
    const a = ray.direction.lengthSquared();
    const halfB = oc.dot(ray.direction);
    const c = oc.lengthSquared() - this.radius * this.radius;

    const discriminant = halfB * halfB - a * c;
    if (discriminant < 0) {
      return null;
    }

    const sqrtD = Math.sqrt(discriminant);
    let root = (-halfB - sqrtD) / a;
    if (root < tMin || tMax < root) {
      root = (-halfB + sqrtD) / a;
      if (root < tMin || tMax < root) {
        return null;
      }
    }

    const point = ray.at(root);
    const outwardNormal = point.subtract(this.center).divide(this.radius);
    const hitRecord = new HitRecord(point, outwardNormal, root, this.material);
    hitRecord.setFaceNormal(ray, outwardNormal);

    return hitRecord;
  }
}
