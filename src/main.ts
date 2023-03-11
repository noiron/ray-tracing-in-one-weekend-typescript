import Color, { writeColor } from "./Color";
import Hittable from "./Hittable";
import HittableList from "./HittableList";
import Point3 from "./Point3";
import Ray from "./Ray";
import Sphere from "./Sphere";
import Vec3 from "./Vec3";

function rayColor(ray: Ray, world: Hittable) {
  const hitRecord = world.hit(ray, 0, Infinity);
  if (hitRecord) {
    return hitRecord.normal.add(new Color(1, 1, 1)).scale(0.5);
  }

  const unitDirection = ray.direction.unit(); // -1 < y < 1
  const t = 0.5 * (unitDirection.y + 1.0);
  return new Color(1, 1, 1).scale(1 - t).add(new Color(0.5, 0.7, 1.0).scale(t));
}

function main() {
  // Image
  const aspectRatio = 16 / 9;
  const imageWidth = 400;
  const imageHeight = Math.floor(imageWidth / aspectRatio);

  const world = new HittableList();
  world.add(new Sphere(new Point3(0, 0, -1), 0.5));
  world.add(new Sphere(new Point3(0, -100.5, -1), 100));

  // Camera
  const viewportHeight = 2;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1;

  const origin = new Point3(0, 0, 0);
  const horizontal = new Vec3(viewportWidth, 0, 0);
  const vertical = new Vec3(0, viewportHeight, 0);
  const lowerLeftCorner = origin
    .subtract(horizontal.divide(2))
    .subtract(vertical.divide(2))
    .subtract(new Vec3(0, 0, focalLength));

  // Render
  console.log(`P3\n${imageWidth} ${imageHeight}\n255`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    process.stderr.clearLine(0);
    process.stderr.cursorTo(0);
    process.stderr.write(`Scanlines remaining: ${j}`);

    for (let i = 0; i < imageWidth; ++i) {
      const u = i / (imageWidth - 1);
      const v = j / (imageHeight - 1);

      const ray = new Ray(
        origin,
        lowerLeftCorner
          .add(horizontal.scale(u))
          .add(vertical.scale(v))
          .subtract(origin)
      );
      const pixelColor = rayColor(ray, world);

      writeColor(pixelColor);
    }
  }

  process.stderr.write("\nDone.\n");
}

main();
