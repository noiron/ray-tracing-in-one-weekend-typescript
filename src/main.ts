function main() {
  // Image
  const imageWidth = 256;
  const imageHeight = 256;

  // Render
  console.log(`P3\n${imageWidth} ${imageHeight}\n255`);

  for (let j = imageHeight - 1; j >= 0; --j) {
    process.stderr.clearLine(0);
    process.stderr.cursorTo(0);
    process.stderr.write(`Scanlines remaining: ${j}`);

    for (let i = 0; i < imageWidth; ++i) {
      const r = i / (imageWidth - 1);
      const g = j / (imageHeight - 1);
      const b = 0.25;

      const ir = Math.floor(255.999 * r);
      const ig = Math.floor(255.999 * g);
      const ib = Math.floor(255.999 * b);

      console.log(`${ir} ${ig} ${ib}`);
    }
  }

  process.stderr.write('\nDone.\n');
}

main();
