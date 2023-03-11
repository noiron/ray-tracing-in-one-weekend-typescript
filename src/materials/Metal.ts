import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import { reflect } from "../Vec3";

export default class Metal implements Material {
  albedo: Color;

  constructor(a: Color) {
    this.albedo = a;
  }

  scatter(hitRecord: HitRecord, ray: Ray): Scattered | null {
    const reflected = reflect(ray.direction.unit(), hitRecord.normal);
    const scattered = new Ray(hitRecord.point, reflected);

    if (scattered.direction.dot(hitRecord.normal) <= 0) {
      return null;
    }

    return {
      attenuation: this.albedo,
      ray: scattered,
    };
  }
}
