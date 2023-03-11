import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import { refract } from "../Vec3";

export default class Dielectric implements Material {
  indexOfRefraction: number;

  constructor(indexOfRefraction: number) {
    this.indexOfRefraction = indexOfRefraction;
  }

  scatter(hitRecord: HitRecord, rayIn: Ray): Scattered | null {
    const refractionRatio = hitRecord.frontFace
      ? 1.0 / this.indexOfRefraction
      : this.indexOfRefraction;

    const unitDirection = rayIn.direction.unit();
    const refracted = refract(unitDirection, hitRecord.normal, refractionRatio);

    const scattered = new Ray(hitRecord.point, refracted);

    return {
      attenuation: new Color(1, 1, 1),
      ray: scattered,
    };
  }
}
