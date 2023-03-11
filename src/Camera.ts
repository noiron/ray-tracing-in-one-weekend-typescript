import Ray from "./Ray";
import Vec3 from "./Vec3";
import Point3 from "./Point3";
import { degreesToRadians } from "./utils";

class Camera {
  origin: Point3;
  lowerLeftCorner: Point3;
  horizontal: Vec3;
  vertical: Vec3;

  constructor(
    lookfrom: Point3,
    lookat: Point3,
    vup: Vec3,
    vfov: number,
    aspectRatio: number
  ) {
    const theta = degreesToRadians(vfov);
    const h = Math.tan(theta / 2);
    const viewportHeight = 2.0 * h;
    const viewportWidth = aspectRatio * viewportHeight;

    const w = lookfrom.subtract(lookat).unit();
    const u = vup.cross(w).unit();
    const v = w.cross(u);

    this.origin = lookfrom;
    this.horizontal = u.scale(viewportWidth);
    this.vertical = v.scale(viewportHeight);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.divide(2))
      .subtract(this.vertical.divide(2))
      .subtract(w);
  }

  getRay(s: number, t: number): Ray {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.scale(s))
        .add(this.vertical.scale(t))
        .subtract(this.origin)
    );
  }
}

export default Camera;
