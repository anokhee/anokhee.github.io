class Pendulum {
  constructor(anchorPoint, stringLength, mass, note) {
    this.anchorPoint = anchorPoint;
    this.stringLength = stringLength;
    this.mass = mass;
    this.showBoundingBox = false;
    this.note = note;

    this.angle = 0;
    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.damping = random(
      PENDULUM.velocityDamping.min,
      PENDULUM.velocityDamping.max
    );

    let brightness;

    let values = Object.values(selectedPalette);
    let col = random(values);
    this.shapeType = random(CONFIG.shapeTypes);
    this.boundingBoxColor = color(255, 0, 0, brightness);
    this.fillCol = color(col.r, col.g, col.b);
    this.strokeColor = color(0);
    this.strokeWeight = 1;
    this.opacity = 255;
    this.shapeRotation = random(TWO_PI);
  }

  update() {
    if (draggingPendulum === this) return;

    this.angularAcceleration =
      (-CONFIG.gravity / this.stringLength) * sin(this.angle);

    this.angularVelocity += this.angularAcceleration;
    this.angularVelocity *= pow(this.damping, this.mass * 0.03);
    this.angle += this.angularVelocity;
  }

  display() {
    let bobPointX = this.anchorPoint.x + this.stringLength * sin(this.angle);
    let bobPointY = this.anchorPoint.y + this.stringLength * cos(this.angle);
    let bobPoint = createVector(bobPointX, bobPointY);

    // Sets scaleFactors for each shape type to make sure they fit inside the bounding circle
    let scaleFactor = { x: 1, y: 1, z: 1 }; // default for configuring
    if (this.shapeType === "flower") {
      scaleFactor = { x: 0.25, y: 0.7, z: 0.25 };
    } else if (this.shapeType === "polygon") {
      scaleFactor = { x: 0.5, y: 0.5, z: 0.25 };
    } else if (this.shapeType === "star") {
      scaleFactor = { x: 0.5, y: 0.25, z: 0.25 };
    }

    let shape = new BaseShape(
      bobPoint.x,
      bobPoint.y,
      this.shapeType,
      this.mass * scaleFactor.x,
      this.mass * scaleFactor.y,
      this.mass * scaleFactor.z,
      5,
      {
        fillColor: this.fillCol,
        strokeColor: this.strokeColor,
        strokeWeight: this.strokeWeight,
        opacity: this.opacity,
        rotation: this.shapeRotation,
      }
    );

    let stringColor;
    if (backgroundColor === selectedPalette.darkest) {
      stringColor = selectedPalette.light;
    } else {
      stringColor = selectedPalette.veryDark;
    }

    this.strokeColor = color(stringColor.r, stringColor.g, stringColor.b);

    stroke(stringColor.r, stringColor.g, stringColor.b);
    line(this.anchorPoint.x, this.anchorPoint.y, bobPoint.x, bobPoint.y);

    if (this.showBoundingBox) {
      // Draw the bob
      fill(this.boundingBoxColor);
      // bounding sphere
      ellipse(bobPoint.x, bobPoint.y, this.mass, this.mass);
    } else {
    }

    // Draw the bob
    fill(this.fillCol);
    // Draw the flower shape without scaling
    shape.display();
  }

  getBobPosition() {
    return {
      x: this.anchorPoint.x + this.stringLength * sin(this.angle),
      y: this.anchorPoint.y + this.stringLength * cos(this.angle),
    };
  }

  getZ() {
    this.brightness = map(
      this.mass,
      PENDULUM.mass.min,
      PENDULUM.mass.max,
      255,
      255
    );

    // simulate a Z position for sorting and collision logic
    return sin(this.angle) * this.stringLength * 0.3;
  }

  updateZ(baseY, threshold = 5) {
    const bobY = this.anchorPoint.y + this.stringLength * cos(this.angle);

    if (bobY > baseY + threshold) {
      this.z = "front";
      this.opacity = 255;
    } else if (bobY < baseY - threshold) {
      this.z = "back";
      this.opacity = 255;
    } else {
      this.z = "middle";
      this.opacity = 255; // or whatever you want for "middle"
    }
  }
}
