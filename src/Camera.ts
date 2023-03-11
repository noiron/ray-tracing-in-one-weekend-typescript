import Ray from "./Ray";
import Vec3, { randomInUnitDisk } from "./Vec3";
import Point3 from "./Point3";
import { degreesToRadians } from "./utils";

class Camera {
  origin: Point3;
  lowerLeftCorner: Point3;
  horizontal: Vec3;
  vertical: Vec3;
  lensRadius: number;
  u: Vec3;
  v: Vec3;

  constructor(
    lookfrom: Point3,
    lookat: Point3,
    vup: Vec3,
    vfov: number,
    aspectRatio: number,
    aperture: number,
    focusDist: number
  ) {
    const theta = degreesToRadians(vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2.0 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    const w = lookfrom.subtract(lookat).unit();
    this.u = vup.cross(w).unit();
    this.v = w.cross(this.u);

    this.origin = lookfrom;
    this.horizontal = this.u.scale(viewportWidth).scale(focusDist);
    this.vertical = this.v.scale(viewportHeight).scale(focusDist);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.divide(2))
      .subtract(this.vertical.divide(2))
      .subtract(w.scale(focusDist));

    this.lensRadius = aperture / 2;
  }

  getRay(s: number, t: number): Ray {
    const rd = randomInUnitDisk().scale(this.lensRadius);
    const offset = this.u.scale(rd.x).add(this.v.scale(rd.y));

    return new Ray(
      this.origin.add(offset),
      this.lowerLeftCorner
        .add(this.horizontal.scale(s))
        .add(this.vertical.scale(t))
        .subtract(this.origin)
        .subtract(offset)
    );
  }
}

export default Camera;
