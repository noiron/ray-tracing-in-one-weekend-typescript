import Vec3 from "./Vec3";

export default class Color extends Vec3 {}

export function writeColor(color: Color) {
  const ir = Math.floor(255.999 * color.x);
  const ig = Math.floor(255.999 * color.y);
  const ib = Math.floor(255.999 * color.z);

  console.log(`${ir} ${ig} ${ib}`);
}
