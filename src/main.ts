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
  const world = new HittableList();

  const materialGround = new Lambertian(new Color(0.8, 0.8, 0.0));
  const materialCenter = new Lambertian(new Color(0.1, 0.2, 0.5));
  const materialLeft = new Dielectric(1.5);
  const materialRight = new Metal(new Color(0.8, 0.6, 0.2), 0.0);

  world.add(new Sphere(new Point3(0.0, -100.5, -1.0), 100.0, materialGround));
  world.add(new Sphere(new Point3(0.0, 0.0, -1.0), 0.5, materialCenter));
  world.add(new Sphere(new Point3(-1.0, 0.0, -1.0), 0.5, materialLeft));
  world.add(new Sphere(new Point3(-1.0, 0.0, -1.0), -0.45, materialLeft));
  world.add(new Sphere(new Point3(1.0, 0.0, -1.0), 0.5, materialRight));

  // Camera
  const lookfrom = new Point3(3, 3, 2);
  const lookat = new Point3(0, 0, -1);
  const vup = new Vec3(0, 1, 0);
  const distToFocus = lookfrom.subtract(lookat).length();
  const aperture = 2.0;

  const camera = new Camera(
    lookfrom,
    lookat,
    vup,
    20,
    aspectRatio,
    aperture,
    distToFocus
  );

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
