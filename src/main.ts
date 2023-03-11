import Camera from "./Camera";
import Color, { writeColor } from "./Color";
import Hittable from "./Hittable";
import HittableList from "./HittableList";
import Dielectric from "./materials/Dielectric";
import Lambertian from "./materials/Lambertian";
import Metal from "./materials/Metal";
import Point3 from "./Point3";
import Ray from "./Ray";
import Sphere from "./Sphere";
import { random } from "./utils";
import Vec3 from "./Vec3";

function rayColor(ray: Ray, world: Hittable, depth: number): Color {
  if (depth <= 0) {
    return new Color(0, 0, 0);
  }

  // Here 0.001 is for fixing shadow acne
  const hitRecord = world.hit(ray, 0.001, Infinity);
  if (hitRecord) {
    const scattered = hitRecord.material.scatter(hitRecord, ray);

    if (scattered) {
      return rayColor(scattered.ray, world, depth - 1).multiply(
        scattered.attenuation
      );
    }
    return new Color(0, 0, 0);
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
  const samplesPerPixel = 100;
  const maxDepth = 50;

  // World
  const R = Math.cos(Math.PI / 4);
  const world = new HittableList();

  const materialLeft = new Lambertian(new Color(0, 0, 1));
  const materialRight = new Lambertian(new Color(1, 0, 0));

  world.add(new Sphere(new Point3(-R, 0.0, -1.0), R, materialLeft));
  world.add(new Sphere(new Point3(R, 0.0, -1.0), R, materialRight));

  // Camera
  const camera = new Camera(90.0, aspectRatio);

  // Render
  console.log(`P3\n${imageWidth} ${imageHeight}\n255`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    process.stderr.clearLine(0);
    process.stderr.cursorTo(0);
    process.stderr.write(`Scanlines remaining: ${j}`);

    for (let i = 0; i < imageWidth; ++i) {
      let pixelColor = new Color(0, 0, 0);
      for (let s = 0; s < samplesPerPixel; s++) {
        const u = (i + random()) / (imageWidth - 1);
        const v = (j + random()) / (imageHeight - 1);
        const r = camera.getRay(u, v);
        pixelColor = pixelColor.add(rayColor(r, world, maxDepth));
      }

      writeColor(pixelColor, samplesPerPixel);
    }
  }

  process.stderr.write("\nDone.\n");
}

main();
