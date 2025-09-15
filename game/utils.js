const MAX_SITTING_TIME = 6000;
const MAX_SITTING_PARTICLES = 700;

function recycleSittingParticles(particles) {
  // Count how many are sitting
  let sittingParticles = particles.filter((p) => p.timeSitting > 0);

  if (sittingParticles.length > MAX_SITTING_PARTICLES) {
    for (let p of sittingParticles) {
      if (p.timeSitting > MAX_SITTING_TIME) {
        p.recycleParticles();
        p.timeSitting = 0;
        p.isFalling = true; // start falling again
      }
    }
  }
}

const UTILS = {
  getRandomPoint(
    min = { x: 0, y: 0 },
    max = { x: windowWidth, y: windowHeight }
  ) {
    return createVector(random(min.x, max.x), random(min.y, max.y));
  },
  getColorFromPalette(paletteName) {
    const colors = COLORPALETTES[paletteName];
    const c = random(Object.values(colors));
    return color(c.r, c.g, c.b);
  },
  isWithinRadius(x1, y1, x2, y2, radius) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy < radius * radius;
  },
  createRandomShape(palette, isOpaque) {
    const type = random(CONFIG.shapeTypes);
    const position = this.getRandomPoint();
    const radius1 = random(
      CONFIG.particle.baseSize.min,
      CONFIG.particle.baseSize.max
    );

    const radius2 = random(
      CONFIG.particle.baseSize.min,
      CONFIG.particle.baseSize.max
    );
    const radius3 =
      random(CONFIG.particle.baseSize.min, CONFIG.particle.baseSize.max) *
      CONFIG.particle.pistilCoeff;
    const points = floor(
      random(CONFIG.particle.numPoints.min, CONFIG.particle.numPoints.max)
    );
    const fill1 = this.getColorFromPalette(palette);
    const fill2 = this.getColorFromPalette(palette);
    const fill3 = color(1, 1, 1, 0); // unused?
    const rotation = random(-1, 1);

    return new Shape(
      type,
      position.x,
      position.y,
      radius1,
      radius2,
      radius3,
      points,
      fill1,
      fill2,
      fill3,
      rotation,
      isOpaque
    );
  },
};
