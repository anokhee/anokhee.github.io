// initialize particle arrays
let fallingParticles = [];
let burstingParticles = [];
let bgc = COLORPALETTES.blues.medium;

let Mouse = {
  prev: { x: 0, y: 0 },
  vel: { x: 0, y: 0 },
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.id("heroCanvas");
  generateFallingParticles(fallingParticles, "blues");
}

function draw() {
  background(bgc.r, bgc.g, bgc.b);

  for (let p of fallingParticles) {
    p.applyForce(Mouse);
    p.update(fallingParticles);
    p.draw();
  }

  for (let i = burstingParticles.length - 1; i >= 0; i--) {
    let p = burstingParticles[i];
    p.update();
    p.applyForce(Mouse);
    p.draw();
    if (p.isDead()) {
      burstingParticles.splice(i, 1);
    }
  }
  updateMouse();
  recycleSittingParticles(burstingParticles);
}

function windowResized() {
  fallingParticles = [];
  resizeCanvas(windowWidth, windowHeight);
  setup();
}

function updateMouse() {
  Mouse.vel.x = mouseX - Mouse.prev.x;
  Mouse.vel.y = mouseY - Mouse.prev.y;
  Mouse.prev.x = mouseX;
  Mouse.prev.y = mouseY;

  fill(0, 0, 255, 25);
  ellipse(mouseX, mouseY, CONFIG.mouseRadius);
}

function mousePressed() {
  generateBurstParticles(burstingParticles, "sakura");
}

function generateFallingParticles(arr, palette) {
  for (let i = 0; i < CONFIG.particle.numParticles; i++) {
    const shape = UTILS.createRandomShape(palette, (isOpaque = true));
    arr.push(new Particle(shape, (enableStacking = false)));
  }
}

function generateBurstParticles(arr, palette) {
  for (let i = 0; i < 50; i++) {
    const shape = UTILS.createRandomShape(palette, (isOpaque = true));
    const p = new Particle(shape, true);
    p.burst(mouseX, mouseY);
    arr.push(p);
  }
}
