export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180.0;
}

export function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min;
}

export function clamp(x: number, min: number, max: number) {
  if (x < min) return min;
  if (x > max) return max;
  return x;
}
