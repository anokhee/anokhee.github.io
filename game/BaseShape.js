class BaseShape {
  constructor(x, y, type, r1, r2 = null, r3 = null, numPoints, style = {}) {
    this.position = createVector(x, y);
    this.type = type;
    this.r1 = r1;
    this.r2 = r2 ?? r1;
    this.r3 = r3 ?? r1 / 2;
    this.numPoints = numPoints;

    this.fillColor = style.fillColor ?? "pink";
    this.strokeColor = style.strokeColor ?? null;
    this.strokeWeight = style.strokeWeight ?? 1;
    this.opacity = style.opacity ?? 255;
    this.rotation = style.rotation ?? 0;

    this.pointsArr = [];
    this.controlPoints = []; // For bezier control points in flowers

    this.calculatePoints();
  }

  calculatePoints() {
    this.pointsArr = [];
    this.controlPoints = [];

    if (this.type === "flower") {
      let n = this.numPoints;
      let inner = this.r1;
      let outer = this.r2;
      let offset = PI / n;

      for (let i = 0; i < n; i++) {
        let angle = (TWO_PI * i) / n;

        // Outer control points for bezier
        let c1 = {
          x: outer * cos(angle - offset),
          y: outer * sin(angle - offset),
        };
        let c2 = {
          x: outer * cos(angle + offset),
          y: outer * sin(angle + offset),
        };
        this.controlPoints.push({ c1, c2 });

        // Inner vertex points
        let v = {
          x: inner * cos(angle - offset),
          y: inner * sin(angle - offset),
        };
        this.pointsArr.push(v);
      }
    } else if (this.type === "star") {
      let n = this.numPoints;
      let radius1 = this.r1;
      let radius2 = this.r2;

      for (let i = 0; i < n * 2; i++) {
        let angle = (PI * i) / n;
        let r = i % 2 === 0 ? radius1 : radius2;
        this.pointsArr.push({
          x: r * cos(angle),
          y: r * sin(angle),
        });
      }
    } else if (this.type === "polygon") {
      let n = this.numPoints;
      let r1 = this.r1;
      let r2 = this.r2;

      for (let i = 0; i < n; i++) {
        let angle = (TWO_PI * i) / n;
        this.pointsArr.push({
          x: r1 * cos(angle),
          y: r2 * sin(angle),
        });
      }
    }
  }

  display() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.rotation);

    if (this.strokeColor !== null) {
      stroke(this.strokeColor);
      strokeWeight(this.strokeWeight);
    } else {
      noStroke();
    }

    let c = color(this.fillColor);
    c.setAlpha(this.opacity);
    fill(c);

    beginShape();

    if (this.type === "flower") {
      let n = this.numPoints;
      for (let i = 0; i < n; i++) {
        let v = this.pointsArr[i];
        let c1 = this.controlPoints[i].c1;
        let c2 = this.controlPoints[i].c2;
        let nextIndex = (i + 1) % n;
        let nextV = this.pointsArr[nextIndex];

        vertex(v.x, v.y);
        bezierVertex(c1.x, c1.y, c2.x, c2.y, nextV.x, nextV.y);
      }
    } else {
      // polygon and star just use vertex points
      for (let v of this.pointsArr) {
        vertex(v.x, v.y);
      }
    }

    endShape(CLOSE);

    if (this.type === "flower") {
      fill(
        selectedPalette.medium.r,
        selectedPalette.medium.g,
        selectedPalette.medium.b
      );
      ellipse(0, 0, this.r3);
    }

    pop();
  }

  returnPoints() {
    return this.pointsArr;
  }
}
