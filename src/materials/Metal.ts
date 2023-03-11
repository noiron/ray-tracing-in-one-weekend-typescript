import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import { randomInUnitSphere, reflect } from "../Vec3";

export default class Metal implements Material {
  albedo: Color;
  fuzz: number;

  constructor(albedo: Color, fuzz: number) {
    this.albedo = albedo;
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }

  scatter(hitRecord: HitRecord, ray: Ray): Scattered | null {
    const reflected = reflect(ray.direction.unit(), hitRecord.normal);
    const scattered = new Ray(
      hitRecord.point,
      reflected.add(randomInUnitSphere().scale(this.fuzz))
    );

    if (scattered.direction.dot(hitRecord.normal) <= 0) {
      return null;
    }

    return {
      attenuation: this.albedo,
      ray: scattered,
    };
  }
}
