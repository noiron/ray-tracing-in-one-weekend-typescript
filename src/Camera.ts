import Ray from "./Ray";
import Vec3 from "./Vec3";
import Point3 from "./Point3";

class Camera {
  origin: Point3;
  lowerLeftCorner: Point3;
  horizontal: Vec3;
  vertical: Vec3;

  constructor() {
    // Image
    const aspectRatio = 16 / 9;
    const viewportHeight = 2;
    const viewportWidth = aspectRatio * viewportHeight;
    const focalLength = 1;

    this.origin = new Point3(0, 0, 0);
    this.horizontal = new Vec3(viewportWidth, 0, 0);
    this.vertical = new Vec3(0, viewportHeight, 0);
    this.lowerLeftCorner = this.origin
      .subtract(this.horizontal.divide(2))
      .subtract(this.vertical.divide(2))
      .subtract(new Vec3(0, 0, focalLength));
  }

  getRay(u: number, v: number): Ray {
    return new Ray(
      this.origin,
      this.lowerLeftCorner
        .add(this.horizontal.scale(u))
        .add(this.vertical.scale(v))
        .subtract(this.origin)
    );
  }
}

export default Camera;
