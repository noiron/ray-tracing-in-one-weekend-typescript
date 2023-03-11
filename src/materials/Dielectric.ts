import Color from "../Color";
import { HitRecord } from "../Hittable";
import { Material, Scattered } from "../Material";
import Ray from "../Ray";
import { random } from "../utils";
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
    if (
      cannotRefract ||
      Dielectric.reflectance(cosTheta, refractionRatio) > random()
    ) {
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

  static reflectance(cosine: number, refIdx: number) {
    // Use Schlick's approximation for reflectance.
    let r0 = (1 - refIdx) / (1 + refIdx);
    r0 = r0 * r0;
    return r0 + (1 - r0) * (1 - cosine) ** 5;
  }
}
