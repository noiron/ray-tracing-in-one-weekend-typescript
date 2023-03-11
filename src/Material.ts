import Color from "./Color";
import { HitRecord } from "./Hittable";
import Ray from "./Ray";

export type Scattered = { attenuation: Color; ray: Ray };

export interface Material {
  scatter(hitRecord: HitRecord, rayIn?: Ray): Scattered | null;
}
