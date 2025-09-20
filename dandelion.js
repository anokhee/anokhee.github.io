// ---------------------- CONFIG ----------------------
const angularSpeed = 0.005;
let dandelions = [];
let particles = [];
let paletteIndex = 0;

// Palettes + matching flower presets
const PALETTES = [
  {
    name: "deep purple with orange glow",
    bg: ["#FFFDFB", "#E2725B"],
    petalLight: "#E2725B",
    petalDark: "#352E5F",
    glow: "#9A7AA0",
    dots: "#EEDC9A",
    center1: "#5F3A53",
    center2: "#894546",
    center3: "#DD5B2C",
  },
  {
    name: "black with orange glow",
    bg: ["#FFFDFB", "#E2725B"],
    petalLight: "#ffffff",
    petalDark: "#010101",
    glow: "#ffffff",
    dots: "#ffffff",
    center1: "#010101",
    center2: "#ffffff",
    center3: "#ffffff",
  },
];

const FLOWER_PRESETS = [
  {
    name: "Daisy",
    petals: 12,
    length: 90,
    center: 35,
    widthK: 0.42,
    tip: 0.55,
    base: 0.12,
  },
  {
    name: "Pansy",
    petals: 6,
    length: 90,
    center: 35,
    widthK: 0.42,
    tip: 0.55,
    base: 0.12,
  },
];

let PALETTE = PALETTES[0];
let PRESET = FLOWER_PRESETS[0];

// ---------------------- p5: SETUP / DRAW ----------------------
function setup() {
  const cnv = createCanvas(windowWidth / 2, windowHeight * 0.4);
  cnv.parent("deco");
  dandelions.push(new Dandelion(width / 2, height / 2, PRESET));
  applyPalette(paletteIndex);
}

function draw() {
  background(255, 254, 251, 180);

  const cx = windowWidth / 2,
    cy = windowHeight / 2;

  // Flower
  for (let d of dandelions) {
    d.update();
    d.display();
  }

  // Pollen
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function windowResized() {
  resizeCanvas(width, height);
}

// Keyboard: shuffle palettes with P
function keyPressed() {
  if (key === "p" || key === "P") {
    let next = paletteIndex;
    if (PALETTES.length > 1) {
      do {
        next = floor(random(PALETTES.length));
      } while (next === paletteIndex);
    }
    paletteIndex = next;
    applyPalette(paletteIndex);
  }
}

function setRadialFill(cx, cy, radius, hex, alphaCenter, alphaEdge) {
  const ctx = drawingContext;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, hexA(hex, alphaCenter));
  grad.addColorStop(1.0, hexA(hex, alphaEdge));
  ctx.fillStyle = grad;
}

function setPetalGradient(x0, y0, x1, y1, c0, c1, a) {
  const ctx = drawingContext;
  const grad = ctx.createLinearGradient(x0, y0, x1, y1);
  grad.addColorStop(0.0, hexA(c0, a));
  grad.addColorStop(0.8, hexA(c1, a));
  grad.addColorStop(1.0, hexA(c1, a));
  ctx.fillStyle = grad;
}

function hexA(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha / 255})`;
}
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

class Dandelion {
  constructor(x, y, preset) {
    this.pos = createVector(x, y);
    this.petalLength = preset.length;
    this.centerDiameter = preset.center;
    this.widthK = preset.widthK;
    this.tipScale = preset.tip;
    this.baseScale = preset.base;
    this.numPetalsFloat = preset.petals;

    this.from = null;
    this.to = null;
    this.t = 0;
    this.morphing = false;
  }

  morphTo(preset) {
    this.from = {
      length: this.petalLength,
      center: this.centerDiameter,
      widthK: this.widthK,
      tip: this.tipScale,
      base: this.baseScale,
      petals: this.numPetalsFloat,
    };
    this.to = {
      length: preset.length,
      center: preset.center,
      widthK: preset.widthK,
      tip: preset.tip,
      base: preset.base,
      petals: preset.petals,
    };
    this.t = 0.01;
    this.morphing = true;
  }

  update() {
    if (!this.morphing) return;
    this.t = min(1, this.t + 0.03);
    const k = easeInOutCubic(this.t);

    this.petalLength = lerp(this.from.length, this.to.length, k);
    this.centerDiameter = lerp(this.from.center, this.to.center, k);
    this.widthK = lerp(this.from.widthK, this.to.widthK, k);
    this.tipScale = lerp(this.from.tip, this.to.tip, k);
    this.baseScale = lerp(this.from.base, this.to.base, k);
    this.numPetalsFloat = lerp(this.from.petals, this.to.petals, k);

    if (this.t >= 1) this.morphing = false;
  }

  display() {
    const baseAngle = frameCount * angularSpeed;
    push();
    translate(this.pos.x, this.pos.y);

    const nFloat = max(1.0, this.numPetalsFloat);
    const nA = floor(nFloat);
    const nB = max(nA, ceil(nFloat));
    const frac = constrain(nFloat - nA, 0, 1);

    if (nA === nB) {
      this.drawPetalSet(nA, baseAngle, 1.0, true);
    } else {
      this.drawPetalSet(nA, baseAngle, 1.0 - frac, false);
      this.drawPetalSet(nB, baseAngle, frac, true);
    }

    noStroke();

    fill(PALETTE.center1 + 10);
    circle(0, 0, this.centerDiameter);
    fill(PALETTE.center2);
    circle(0, 0, this.centerDiameter * 0.66);
    fill(PALETTE.center3);
    circle(0, 0, this.centerDiameter * 0.33);

    pop();
  }

  drawPetalSet(count, baseAngle, alphaMul, allowEmit) {
    if (count < 1) return;

    for (let i = 0; i < count; i++) {
      const angle = baseAngle + (TWO_PI * i) / count;
      const ux = cos(angle),
        uy = sin(angle);
      const nx = -uy,
        ny = ux;

      const base = createVector(0, 0);
      const midLen = this.petalLength / 2;
      const tipLen = this.petalLength;

      const mid = createVector(ux * midLen, uy * midLen);
      const tip = createVector(ux * tipLen, uy * tipLen);

      const angleSpacing = TWO_PI / count;
      const maxPetalWidth = this.petalLength * 0.5;

      const midHalf = min(
        maxPetalWidth,
        angleSpacing * this.petalLength * this.widthK
      );
      const tipHalf = midHalf * this.tipScale;
      const baseHalf = midHalf * this.baseScale;

      const baseL = createVector(
        base.x + nx * baseHalf,
        base.y + ny * baseHalf
      );
      const baseR = createVector(
        base.x - nx * baseHalf,
        base.y - ny * baseHalf
      );
      const midL = createVector(mid.x + nx * midHalf, mid.y + ny * midHalf);
      const midR = createVector(mid.x - nx * midHalf, mid.y - ny * midHalf);
      const tipL = createVector(tip.x + nx * tipHalf, tip.y + ny * tipHalf);
      const tipR = createVector(tip.x - nx * tipHalf, tip.y - ny * tipHalf);

      // gradient fill
      noStroke();
      const petalAlpha = 230 * alphaMul;
      setPetalGradient(
        base.x,
        base.y,
        tip.x,
        tip.y,
        PALETTE.petalLight,
        PALETTE.petalDark,
        petalAlpha
      );

      // subtle spine
      stroke(1, 1, 1, 10 * alphaMul);
      beginShape();
      curveVertex(base.x, base.y);
      curveVertex(tip.x, tip.y);
      endShape(CLOSE);

      // petal body
      noStroke();
      beginShape();
      curveVertex(baseL.x, baseL.y);
      curveVertex(baseL.x, baseL.y);
      curveVertex(midL.x, midL.y);
      curveVertex(tipL.x, tipL.y);
      curveVertex(tipR.x, tipR.y);
      curveVertex(midR.x, midR.y);
      curveVertex(baseR.x, baseR.y);
      curveVertex(baseR.x, baseR.y);
      endShape(CLOSE);

      if (allowEmit && random() < 0.04) {
        particles.push(new Particle(this.pos.x + tip.x, this.pos.y + tip.y));
      }
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    const angle = random(TWO_PI);
    const speed = random(0.1, 1);
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.alpha = 255;
    this.size = random(2, 10);
  }
  update() {
    this.pos.add(this.vel);
    this.alpha -= 2;
  }
  display() {
    let c = color(PALETTE.dots);
    c.setAlpha(this.alpha);
    fill(c);
    noStroke();
    circle(this.pos.x, this.pos.y, this.size / 2);
    circle(this.pos.x, this.pos.y, this.size);
  }
  isDead() {
    return (
      this.alpha <= 0 ||
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }
}

// ---------------------- Palette application ----------------------
function applyPalette(i) {
  const p = PALETTES[i];
  PALETTE.bg = p.bg.slice();
  PALETTE.petalLight = p.petalLight;
  PALETTE.petalDark = p.petalDark;
  PALETTE.glow = p.glow;
  PALETTE.dots = p.dots;

  if (dandelions[0]) dandelions[0].morphTo(FLOWER_PRESETS[i]);
}
