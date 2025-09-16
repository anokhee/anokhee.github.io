// ---------------------- CONFIG ----------------------
const angularSpeed = 0.005;
let dandelions = [];
let particles = [];
let paletteIndex = 0;

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
    name: "Tropical Dawn",
    bg: ["#FFFDFB", "#E2725B"],
    petalLight: "#E2725B",
    petalDark: "#352E5F",
    glow: "#9A7AA0",
    dots: "#EEDC9A",
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
  {
    name: "Mauve",
    bg: ["#5780C7", "#F0F3FA"],
    petalLight: "#D499FF",
    petalDark: "#AA33FF",
    glow: "#EAC435",
    dots: "#D2CAE2",
  },
];

const FLOWER_PRESETS = [
  // Daisy-ish: simple, airy
  {
    name: "Daisy",
    petals: 12,
    length: 90,
    center: 35,
    widthK: 0.42,
    tip: 0.55,
    base: 0.12,
  },

  // Cosmos: long slender petals with soft points
  {
    name: "Cosmos",
    petals: 8,
    length: 110,
    center: 26,
    widthK: 0.34,
    tip: 0.62,
    base: 0.1,
  },

  // Sunflower: many short petals around a bigger center
  {
    name: "Sunflower",
    petals: 24,
    length: 70,
    center: 42,
    widthK: 0.48,
    tip: 0.35,
    base: 0.16,
  },

  // Lotus: broad petals, rounded tips
  {
    name: "Lotus",
    petals: 14,
    length: 100,
    center: 28,
    widthK: 0.66,
    tip: 0.22,
    base: 0.22,
  },

  // Tulip-esque rosette: fewer chunky petals, round base
  {
    name: "Tulip Rosette",
    petals: 6,
    length: 95,
    center: 18,
    widthK: 0.72,
    tip: 0.18,
    base: 0.28,
  },

  // Cherry blossom: short, wide petals with rounded ends
  {
    name: "Sakura",
    petals: 5,
    length: 75,
    center: 24,
    widthK: 0.78,
    tip: 0.16,
    base: 0.2,
  },

  // Dahlia: dense ring, slightly pointy tips
  {
    name: "Dahlia",
    petals: 32,
    length: 85,
    center: 30,
    widthK: 0.54,
    tip: 0.38,
    base: 0.14,
  },

  // Marigold: many small, rounded petals
  {
    name: "Marigold",
    petals: 28,
    length: 60,
    center: 36,
    widthK: 0.68,
    tip: 0.1,
    base: 0.26,
  },

  // Waterlily: wide petals, soft taper
  {
    name: "Waterlily",
    petals: 10,
    length: 120,
    center: 25,
    widthK: 0.62,
    tip: 0.2,
    base: 0.18,
  },

  // Aster: lots of thin, pointy petals
  {
    name: "Aster",
    petals: 40,
    length: 90,
    center: 20,
    widthK: 0.28,
    tip: 0.7,
    base: 0.08,
  },

  // Anemone: medium count, oval-ish petals, bigger center
  {
    name: "Anemone",
    petals: 12,
    length: 80,
    center: 34,
    widthK: 0.58,
    tip: 0.18,
    base: 0.22,
  },

  // Protea-lite: chunky teardrops with sharper tips
  {
    name: "Protea Lite",
    petals: 16,
    length: 105,
    center: 22,
    widthK: 0.46,
    tip: 0.48,
    base: 0.12,
  },
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

    noStroke();

    fill("#5F3A53" + 10);
    circle(0, 0, this.centerDiameter);
    fill("#894546");
    circle(0, 0, this.centerDiameter * 0.66);
    fill("#DD5B2C");
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
