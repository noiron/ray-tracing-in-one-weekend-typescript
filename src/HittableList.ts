import Hittable, { HitRecord } from "./Hittable";
import Ray from "./Ray";

export default class HittableList implements Hittable {
  objects: Hittable[];

  constructor(object?: Hittable) {
    this.objects = object ? [object] : [];
  }

  clear = () => {
    this.objects = [];
  };

  add = (object: Hittable) => {
    this.objects.push(object);
  };

  hit = (ray: Ray, tMin: number, tMax: number): HitRecord | null => {
    let closestHit: HitRecord | null = null;

    for (const object of this.objects) {
      const objectHit = object.hit(ray, tMin, closestHit?.t ?? tMax);

      if (objectHit) {
        closestHit = objectHit;
      }
    }
    return closestHit;
  };
}
