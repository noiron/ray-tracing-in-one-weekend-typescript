import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import { randomUnitVector } from "../Vec3";

export default class Lambertian implements Material {
  albedo: Color;

  constructor(albedo: Color) {
    this.albedo = albedo;
  }

  scatter(hitRecord: HitRecord): Scattered {
    let scatterDirection = hitRecord.normal.add(randomUnitVector());

    if (scatterDirection.nearZero()) {
      scatterDirection = hitRecord.normal;
    }

    const scatteredRay = new Ray(hitRecord.point, scatterDirection);

    return {
      ray: scatteredRay,
      attenuation: this.albedo,
    };
  }
}
