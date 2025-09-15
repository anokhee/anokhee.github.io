// ---------------------- CONFIG ----------------------
const angularSpeed = 0.005;
let dandelions = [];
let particles = [];
let paletteIndex = 1;

// Active palette (mutated by applyPalette)
const PALETTE = {
  bg: ["#001F29", "#EE4266"], // [dark, accent]
  petalLight: "#BEACEC",
  petalDark: "#522AB7",
  glow: "#FFFAEB",
  dots: "#C1D0EC",
};

// Palettes + matching flower presets
const PALETTES = [
  {
    name: "Mauve",
    bg: ["#B333D7", "#D13987"],
    petalLight: "#5CD6FF",
    petalDark: "#6FA3EB",
    glow: "#EAC435",
    dots: "#EAC435",
  },
  {
    name: "Tropical Dawn",
    bg: ["#F7F1F8", "#D8BBDD"],
    petalLight: "#E2C878",
    petalDark: "#6FA3EB",
    glow: "#E2C878",
    dots: "#B7D1F5",
  },
  {
    name: "Mango Lassi Night",
    bg: ["#2B1510", "#FF9F1C"],
    petalLight: "#FFD166",
    petalDark: "#D35400",
    glow: "#FFF4CC",
    dots: "#FFE0B2",
  },
  {
    name: "Solarpunk Meadow",
    bg: ["#08251C", "#84FF00"],
    petalLight: "#C4FCEF",
    petalDark: "#0FA3B1",
    glow: "#F2FFE6",
    dots: "#B8EBD0",
  },
  {
    name: "Cotton-Candy Carnival",
    bg: ["#2A0E37", "#00D1FF"],
    petalLight: "#FFD6F6",
    petalDark: "#9B5DE5",
    glow: "#FFF0F8",
    dots: "#C0F5FF",
  },
  {
    name: "Spicy Papaya",
    bg: ["#2B1A0E", "#FF6F00"],
    petalLight: "#FFB997",
    petalDark: "#E63946",
    glow: "#FFF2D5",
    dots: "#FFD6A5",
  },
  {
    name: "Berry Sherbet",
    bg: ["#2D132C", "#FF9E00"],
    petalLight: "#FDE2FF",
    petalDark: "#7A1E76",
    glow: "#FFF5E6",
    dots: "#FFD8F0",
  },
  {
    name: "Coral Reef",
    bg: ["#112016", "#FF7F5C"],
    petalLight: "#A7FDE8",
    petalDark: "#1C7C54",
    glow: "#F8FFE5",
    dots: "#BFEDEF",
  },
];

const FLOWER_PRESETS = [
  { petals: 12, length: 100, center: 30, widthK: 0.4, tip: 0.4, base: 0 },
  { petals: 5, length: 80, center: 20, widthK: 0.55, tip: 0.4, base: 0.18 },
  { petals: 20, length: 120, center: 50, widthK: 0.8, tip: 0.1, base: 0.1 },
  { petals: 3, length: 50, center: 30, widthK: 1.0, tip: 0.2, base: 0.2 },
  { petals: 14, length: 75, center: 65, widthK: 0.52, tip: 0.44, base: 0.18 },
  { petals: 8, length: 83, center: 10, widthK: 0.5, tip: 0.5, base: 0.1 },
  { petals: 16, length: 90, center: 20, widthK: 0.47, tip: 0.4, base: 0.18 },
  { petals: 20, length: 44, center: 20, widthK: 0.4, tip: 0.36, base: 0.15 },
];

// ---------------------- p5: SETUP / DRAW ----------------------
function setup() {
  const cnv = createCanvas(280, 250);
  // parent to #deco if it exists, otherwise leave in body
  if (document.getElementById("deco")) cnv.parent("deco");

  const start = FLOWER_PRESETS[0];
  dandelions.push(new Dandelion(width / 2, height / 2, start));

  applyPalette(paletteIndex);
}

function draw() {
  background(255, 254, 251, 180);

  const cx = width / 2,
    cy = height / 2;

  // Pulsating background circles (tinted by palette)
  const pulse1 = sin(frameCount * 0.02) * 10;
  const pulse2 = sin(frameCount * 0.015 + PI / 3) * 20;
  const pulse3 = sin(frameCount * 0.012 + PI / 5) * 30;

  noStroke();
  let dOuter = 200 + pulse3;
  setRadialFill(cx, cy, dOuter / 2, PALETTE.bg[1], 110, 0);
  circle(cx, cy, dOuter);

  let dMid = 180 + pulse2;
  setRadialFill(cx, cy, dMid / 2, PALETTE.bg[0], 140, 25);
  circle(cx, cy, dMid);

  let dInner = 140 + pulse1;
  setRadialFill(cx, cy, dInner / 2, PALETTE.bg[0], 200, 60);
  circle(cx, cy, dInner);

  push();
  blendMode(ADD);
  setRadialFill(cx, cy, (dMid * 1.05) / 2, PALETTE.glow, 220, 0);
  circle(cx, cy, dMid * 1.05);
  setRadialFill(cx, cy, (dInner * 0.9) / 2, PALETTE.glow, 255, 0);
  circle(cx, cy, dInner * 0.9);
  pop();

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

// Keep canvas fixed-size but recenter internals (optional)
function windowResized() {
  resizeCanvas(500, 300);
  if (dandelions[0]) dandelions[0].pos.set(width / 2, height / 2);
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

// ---------------------- Helpers ----------------------
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

// ---------------------- Flower classes ----------------------
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
    this.t = 1;
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
    this.t = 0;
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

    fill(123, 1, 23, 100);
    noStroke();
    circle(0, 0, this.centerDiameter);
    circle(0, 0, this.centerDiameter * 0.66);
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
      const petalAlpha = 205 * alphaMul;
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
