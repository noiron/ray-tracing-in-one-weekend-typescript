import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import Vec3, { reflect, refract } from "../Vec3";

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
    const cosTheta = Math.min(
      unitDirection.negate().dot(hitRecord.normal),
      1.0
    );
    const sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);

    const cannotRefract = refractionRatio * sinTheta > 1.0;
    let direction: Vec3;
    if (cannotRefract) {
      direction = reflect(unitDirection, hitRecord.normal);
    } else {
      direction = refract(unitDirection, hitRecord.normal, refractionRatio);
    }

    const scattered = new Ray(hitRecord.point, direction);

    return {
      attenuation: new Color(1, 1, 1),
      ray: scattered,
    };
  }
}
