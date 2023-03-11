import Camera from "./Camera";
import Color, { writeColor } from "./Color";
import Hittable from "./Hittable";
import HittableList from "./HittableList";
import { Material } from "./Material";
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

function randomScene(): HittableList {
  const world = new HittableList();

  const groundMaterial = new Lambertian(new Color(0.5, 0.5, 0.5));
  world.add(new Sphere(new Point3(0, -1000, 0), 1000, groundMaterial));

  for (let a = -11; a < 11; a++) {
    for (let b = -11; b < 11; b++) {
      const chooseMat = random();
      const center = new Point3(a + 0.9 * random(), 0.2, b + random());

      if (center.subtract(new Point3(4, 0.2, 0)).length() > 0.9) {
        let sphereMaterial: Material;

        if (chooseMat < 0.8) {
          // diffuse
          const albedo = Color.random().multiply(Color.random());
          sphereMaterial = new Lambertian(albedo);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else if (chooseMat < 0.95) {
          // metal
          const albedo = Color.random(0.5, 1);
          const fuzz = random(0, 0.5);
          sphereMaterial = new Metal(albedo, fuzz);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        } else {
          sphereMaterial = new Dielectric(1.5);
          world.add(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }

  const material1 = new Dielectric(1.5);
  world.add(new Sphere(new Point3(0, 1, 0), 1.0, material1));

  const material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
  world.add(new Sphere(new Point3(-4, 1, 0), 1.0, material2));

  const material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
  world.add(new Sphere(new Point3(4, 1, 0), 1.0, material3));

  return world;
}

function main() {
  // Image
  const aspectRatio = 3.0 / 2.0;
  const imageWidth = 1200;
  const imageHeight = imageWidth / aspectRatio;
  const samplesPerPixel = 50; // or 500
  const maxDepth = 50;

  // World
  const world = randomScene();

  // Camera
  const lookfrom = new Point3(13, 2, 3);
  const lookat = new Point3(0, 0, 0);
  const vup = new Vec3(0, 1, 0);
  const distToFocus = 10.0;
  const aperture = 0.1;

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
