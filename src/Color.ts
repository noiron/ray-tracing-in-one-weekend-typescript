import Vec3 from "./Vec3";
import { clamp } from "./utils";

export default class Color extends Vec3 {}

export function writeColor(color: Color, samplesPerPixel: number) {
  let r = color.x;
  let g = color.y;
  let b = color.z;

  // Divide the color by the number of samples.
  const scale = 1.0 / samplesPerPixel;
  r *= scale;
  g *= scale;
  b *= scale;

  const ir = Math.floor(256 * clamp(r, 0.0, 0.999));
  const ig = Math.floor(256 * clamp(g, 0.0, 0.999));
  const ib = Math.floor(256 * clamp(b, 0.0, 0.999));

  // Write the translated [0,255] value of each color component.
  console.log(`${ir} ${ig} ${ib}`);
}
