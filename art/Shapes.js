class Flower {
  constructor(stackNum, x, y, size, petalSize, numPetals, petalColor) {
    this.stackNum = stackNum;
    this.x = x;
    this.y = y;
    this.size = size;
    this.numPetals = numPetals;
    this.petalSize = petalSize;
    this.petalColor = petalColor;
  }

  make() {
    if (this.stackNum === 0) {
      noStroke();
    } else {
      strokeWeight(1);
    }
    let x = this.x;
    let y = this.y;
    const angleIncrement = TWO_PI / this.numPetals;
    fill(this.petalColor);
    beginShape();
    for (let i = 0; i < this.numPetals; i++) {
      const angle = i * angleIncrement;
      const petalAngle = angle - PI / this.numPetals;
      const x1 = x + this.size * cos(petalAngle);
      const y1 = y + this.size * sin(petalAngle);
      const x2 = x + this.petalSize * cos(petalAngle);
      const y2 = y + this.petalSize * sin(petalAngle);
      const x3 = x + this.petalSize * cos(angle + PI / this.numPetals);
      const y3 = y + this.petalSize * sin(angle + PI / this.numPetals);
      const x4 = x + this.size * cos(angle + PI / this.numPetals);
      const y4 = y + this.size * sin(angle + PI / this.numPetals);
      vertex(x1, y1);
      bezierVertex(x2, y2, x3, y3, x4, y4, x1, y1);
    }
    endShape();
  }
}

class Polygon {
  constructor(stackNum, x, y, faceSize, size, numSides, color) {
    this.stackNum = stackNum;
    this.x = x;
    this.y = y;
    this.size = size;
    this.numSides = numSides;
    this.color = color;
  }

  make() {
    if (this.stackNum === 0) {
      noStroke();
    } else {
      strokeWeight(1);
    }
    fill(this.color);
    let angle = TWO_PI / this.numSides;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = this.x + cos(a) * this.size;
      let sy = this.y + sin(a) * this.size;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}

class Star {
  constructor(stackNum, x, y, size, innerSize, numSides, color) {
    this.stackNum = stackNum;
    this.x = x;
    this.y = y;
    this.size = size;
    this.innerSize = innerSize;
    this.numSides = numSides;
    this.color = color;
  }

  make() {
    if (this.stackNum === 0) {
      noStroke();
    } else {
      strokeWeight(1);
    }
    fill(this.color);
    let angle = TWO_PI / this.numSides;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = this.x + cos(a) * this.innerSize;
      let sy = this.y + sin(a) * this.innerSize;
      vertex(sx, sy);
      sx = this.x + cos(a + halfAngle) * this.size;
      sy = this.y + sin(a + halfAngle) * this.size;
      vertex(sx, sy);
    }
    endShape(CLOSE);
  }
}
