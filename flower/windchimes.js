// tracks which pendulum is being dragged, if any
let draggingPendulum = null;

// initializes Howler.js instances for each chime sound
const chimeHowls = {};
for (let note in bellSounds) {
  chimeHowls[note] = new Howl({
    src: [bellSounds[note]],
    volume: 1,
  });
}

// initializes chime base objects
let chimeBase;
let numChimeStrings;

// initializes empty arrays
let chimeStringsArr = [];
let anchorsArr = [];

// sets cooldown time to 5sec to prevent annoying repeated sound triggers for the same collision
const collisionCooldown = 1;
let lastCollisionTimes = new Map();

function setup() {
  createCanvas(windowWidth, windowHeight);

  // randomly sets the number of chime strings based on bounds in the PENDULUM config
  numChimeStrings = random(PENDULUM.numStrings.min, PENDULUM.numStrings.max);

  // sets position of base shape to center on the screen at any width
  let centerX = windowWidth / 2;
  let centerY = CONFIG.chimeLength;

  // creates the chime base shape (IMPORTANT - needs to be here to get points around it)
  chimeBase = new BaseShape(
    centerX,
    centerY,
    "polygon",
    CONFIG.chimeBaseRadius.width,
    CONFIG.chimeBaseRadius.height,
    null,
    null
  );

  // generate anchor points around the chime base shape
  generateChimeBase(chimeBase, 0);

  const chimeNotes = Object.keys(chimeHowls); // or manually define if you need specific order

  let minMass = PENDULUM.mass.min;
  let maxMass = PENDULUM.mass.max;

  for (let i = 0; i < anchorsArr.length; i++) {
    let anchor = createVector(anchorsArr[i].x, anchorsArr[i].y);
    let stringLength = random(
      PENDULUM.stringLength.min,
      PENDULUM.stringLength.max
    );
    let mass = random(minMass, maxMass);

    // Map mass to index in chimeNotes (invert range so heavier mass = lower pitch)
    let noteIndex = floor(
      map(mass, minMass, maxMass, chimeNotes.length - 1, 0)
    );
    noteIndex = constrain(noteIndex, 0, chimeNotes.length - 1);
    let selectedNote = chimeNotes[noteIndex];

    let c = new Pendulum(anchor, stringLength, mass, selectedNote);
    chimeStringsArr.push(c);
  }

  const button = createButton("Randomize Chime");
  button.position(20, windowHeight - 40);
  button.style("font-size", "16px");
  button.style("padding", "10px 20px");
  button.mousePressed(reset);
}

function initializeChimes() {
  // pick a random palette
  let paletteNames = Object.keys(CONFIG.palettes);
  let randomPaletteName = random(paletteNames);
  selectedPalette = CONFIG.palettes[randomPaletteName];
  backgroundColor = selectedPalette.lightest;

  // reset arrays
  chimeStringsArr = [];
  anchorsArr = [];

  numChimeStrings = random(PENDULUM.numStrings.min, PENDULUM.numStrings.max);

  let centerX = windowWidth / 2;
  let centerY = CONFIG.chimeLength;

  chimeBase = new BaseShape(
    centerX,
    centerY,
    "polygon",
    CONFIG.chimeBaseRadius.x,
    CONFIG.chimeBaseRadius.y
  );

  generateChimeBase(chimeBase, 0);

  const chimeNotes = Object.keys(chimeHowls);
  let minMass = PENDULUM.mass.min;
  let maxMass = PENDULUM.mass.max;

  for (let i = 0; i < anchorsArr.length; i++) {
    let anchor = createVector(anchorsArr[i].x, anchorsArr[i].y);
    let stringLength = random(
      PENDULUM.stringLength.min,
      PENDULUM.stringLength.max
    );
    let mass = random(minMass, maxMass);

    let noteIndex = floor(
      map(mass, minMass, maxMass, chimeNotes.length - 1, 0)
    );
    noteIndex = constrain(noteIndex, 0, chimeNotes.length - 1);
    let selectedNote = chimeNotes[noteIndex];

    let c = new Pendulum(anchor, stringLength, mass, selectedNote);
    chimeStringsArr.push(c);
  }
}

function draw() {
  background(backgroundColor.r, backgroundColor.g, backgroundColor.b);

  // updates mouse velocity
  updateMouse();

  let rotation = millis() / CONFIG.rotationSpeedDivisor; // chime base spinning speed

  // if the base is rotating, recalculate new anchor points
  if (CONFIG.isRotating) {
    generateChimeBase(chimeBase, rotation);
  }

  // Update pendulum anchor and decide layer based on anchor's vertical position
  let middleLayerPoints = [];

  for (let i = 0; i < chimeStringsArr.length; i++) {
    let p = chimeStringsArr[i];
    p.anchorPoint = anchorsArr[i];
    p.layer = p.anchorPoint.y > chimeBase.position.y ? "back" : "front";
    p.update();
  }

  let sortedAnchors = anchorsArr
    .map((a, idx) => ({ x: a.x, index: idx }))
    .sort((a, b) => a.x - b.x);

  let edgeCount = floor(anchorsArr.length * 0.1);
  let leftEdgeIndices = sortedAnchors.slice(0, edgeCount).map((a) => a.index);
  let rightEdgeIndices = sortedAnchors.slice(-edgeCount).map((a) => a.index);

  let middleIndices = leftEdgeIndices.concat(rightEdgeIndices);

  for (let i of middleIndices) {
    chimeStringsArr[i].layer = "middle";
    middleLayerPoints.push(chimeStringsArr[i].anchorPoint);
  }

  // Detect and resolve collisions
  handleCollisions(chimeStringsArr);

  // Top half arc (from PI to 0 radians)

  noFill();
  arc(
    chimeBase.position.x,
    chimeBase.position.y,
    chimeBase.r1 * 2,
    chimeBase.r2 * 2,
    0, // start angle (0 degrees)
    PI // stop angle (180 degrees)
  );

  // Draw back pendulums first (fully visible)
  for (let p of chimeStringsArr) {
    if (p.layer === "back") p.display();
  }

  // Fade overlay between back and middle layers
  fill(backgroundColor.r, backgroundColor.g, backgroundColor.b, 100); // adjust alpha for smooth fading
  rect(0, 0, width, height);

  // Draw middle pendulums
  for (let p of chimeStringsArr) {
    if (p.layer === "middle") p.display();
  }

  // Fade overlay between back and middle layers
  fill(backgroundColor.r, backgroundColor.g, backgroundColor.b, 100);
  rect(0, 0, width, height);

  // Draw front pendulums last (fully visible)
  for (let p of chimeStringsArr) {
    if (p.layer === "front") p.display();
  }

  noFill();
  arc(
    chimeBase.position.x,
    chimeBase.position.y,
    chimeBase.r1 * 2,
    chimeBase.r2 * 2,
    PI, // start angle (180 degrees)
    0 // stop angle (0 degrees)
  );
}

// Calculates and stores anchor points around the base shape
function generateChimeBase(baseShape, rotation = 0) {
  anchorsArr = [];
  let cx = baseShape.position.x;
  let cy = baseShape.position.y;
  let r1 = baseShape.r1;
  let r2 = baseShape.r2;

  for (let i = 0; i < numChimeStrings; i++) {
    let angle = rotation + (TWO_PI / numChimeStrings) * i;
    let x = cx + cos(angle) * r1;
    let y = cy + sin(angle) * r2;
    anchorsArr.push(createVector(x, y));
  }
}

// Tracks mouse movement to compute velocity vector
function updateMouse() {
  Mouse.vel.x = mouseX - Mouse.prev.x;
  Mouse.vel.y = mouseY - Mouse.prev.y;
  Mouse.prev.x = mouseX;
  Mouse.prev.y = mouseY;

  fill(0, 0, 255, 100);
  ellipse(mouseX, mouseY, CONFIG.mouseRadius, CONFIG.mouseRadius);
}

// Checks if user clicks on any pendulum bob
function mousePressed() {
  for (let p of chimeStringsArr) {
    let bob = p.getBobPosition();
    if (dist(mouseX, mouseY, bob.x, bob.y) < p.mass / 2) {
      draggingPendulum = p;
      p.angularVelocity = 0;
      break;
    }
  }
}

// Allows user to drag a pendulum
function mouseDragged() {
  if (draggingPendulum) {
    let dx = mouseX - draggingPendulum.anchorPoint.x;
    let dy = mouseY - draggingPendulum.anchorPoint.y;
    draggingPendulum.angle = atan2(dx, dy - 0.001); // bias to avoid NaN
  }
}

// Clears dragging state on mouse release
function mouseReleased() {
  draggingPendulum = null;
}

// Handles collisions between pendulum bobs in the same layer
function handleCollisions(chimeStringsArr) {
  const now = millis() / 1000;
  if (now < 1) return;

  for (let i = 0; i < chimeStringsArr.length; i++) {
    for (let j = i + 1; j < chimeStringsArr.length; j++) {
      let p1 = chimeStringsArr[i];
      let p2 = chimeStringsArr[j];

      // Only collide pendulums on the same visual layer

      // Skip collisions if either pendulum is in the middle layer
      if (p1.layer === "middle" || p2.layer === "middle") {
        continue;
      }

      // Only collide pendulums on the same visual layer
      if (p1.layer !== p2.layer) {
        continue;
      }

      // collision code here
      if (p1.layer !== p2.layer) continue;

      let b1 = p1.getBobPosition();
      let b2 = p2.getBobPosition();

      let dx = b2.x - b1.x;
      let dy = b2.y - b1.y;
      let dist = sqrt(dx * dx + dy * dy);
      let minDist = (p1.mass + p2.mass) / 2;

      if (dist < minDist) {
        let key = i < j ? `${i}-${j}` : `${j}-${i}`;
        let lastCollision = lastCollisionTimes.get(key) || 0;

        if (now - lastCollision > collisionCooldown) {
          // Exchange angular velocities using 1D elastic collision formula
          let v1 = p1.angularVelocity;
          let v2 = p2.angularVelocity;
          let m1 = p1.mass;
          let m2 = p2.mass;

          p1.angularVelocity =
            ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2;
          p2.angularVelocity =
            ((2 * m1) / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2;

          lastCollisionTimes.set(key, now);

          // Play their assigned notes
          chimeHowls[p1.note]?.play();
          chimeHowls[p2.note]?.play();
        }

        // Resolve overlap to avoid sticking
        let overlap = minDist - dist;
        let offsetX = (dx / dist) * (overlap / 2);
        p1.angle -= offsetX / p1.stringLength;
        p2.angle += offsetX / p2.stringLength;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recalculate chime base position
  let centerX = windowWidth / 2;
  let centerY = CONFIG.chimeLength;
  chimeBase.position.set(centerX, centerY);

  // Regenerate anchor points after moving the base
  generateChimeBase(chimeBase, 0);

  // Re-anchor each pendulum to the new points
  for (let i = 0; i < chimeStringsArr.length; i++) {
    chimeStringsArr[i].anchorPoint = anchorsArr[i];
  }
}

function reset() {
  initializeChimes();
}
