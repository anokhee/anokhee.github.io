let rotationAngle = 0;
let shape = [];
let breathingScale = 1;
let isBreathingOut = true;
let selectedShapeType = "flower";
let mouseXInRange;
let mouseYInRange;
let controllersContainer;

function createRotatingShape() {
  rotate(rotationAngle);

  const shapeMapping = {
    flower: Flower,
    star: Star,
    polygon: Polygon,
  };

  for (let i = 0; i < 3; i++) {
    const shapeType = shapeMapping[shapeParams.shapeType.value];

    if (i === 0) {
      push();
      translate(-8, 8);
    }

    shape.push(
      new shapeType(
        i,
        0,
        0,
        shapeParams.faceSize.value,
        shapeParams.outerSize.value,
        shapeParams.numSides.value,
        i === 0 ? "rgba(0, 0, 0, .2)" : shapeParams.shapeColor.value,
        i === 0 ? "rgba(0, 0, 0, 0)" : shapeParams.faceColor.value
      ).make()
    );

    if (i === 0) {
      pop();
    }
  }

  if (isBreathingOut) {
    breathingScale += shapeParams.intensity.value;
    if (breathingScale >= 1.2) {
      isBreathingOut = false;
    }
  } else {
    breathingScale -= shapeParams.intensity.value;
    if (breathingScale <= 0.88) {
      isBreathingOut = true;
    }

    const tiltChange = -shapeParams.intensity.value * 500;
    faceParams.eyebrowOuterCornerTilt +=
      (tiltChange - faceParams.eyebrowOuterCornerTilt) * 0.2;
  }

  rotationAngle += shapeParams.intensity.value;
  return shape;
}

class Face {
  constructor(shape, x, y) {
    this.shape = shape;
    this.x = x;
    this.y = y;
    this.faceColor = color(shapeParams.faceColor.value);
    this.noseHeight = 15;
  }

  createPupil(eyeStartX, eyeEndX, eyeStartY, eyeEndY) {
    const [pupilX, pupilY] = [
      (eyeStartX + eyeEndX) / 2,
      eyeStartY + faceParams.eyeYPos,
    ];

    const pupilSize = faceParams.eyeHeight * 0.5 * breathingScale;
    const eyeSize = faceParams.eyeHeight * breathingScale;

    const angle = atan2(mouseYInRange - pupilY, mouseXInRange - pupilX);
    const maxDistance = eyeSize * 2;
    const pupilXTarget = pupilX + cos(angle) * maxDistance;
    const pupilYTarget = pupilY + sin(angle) * maxDistance;
    const easing = 0.1;
    const pupilXNew = lerp(pupilX, pupilXTarget, easing);
    const pupilYNew = lerp(pupilY, pupilYTarget, easing);

    fill("white");
    ellipse(pupilX, pupilY, eyeSize, eyeSize);

    fill("black");
    ellipse(pupilXNew, pupilYNew, pupilSize, pupilSize);
  }

  drawBezier(startX, startY, c1X, c1Y, c2X, c2Y, endX, endY) {
    bezier(startX, startY, c1X, c1Y, c2X, c2Y, endX, endY);
  }

  drawEyebrow(eyebrow) {
    let flip = 1;
    for (let i = 0; i < 2; i++) {
      if (i === 0) {
        flip = 1;
      } else {
        flip = -1;
      }

      noFill();
      beginShape();
      this.drawBezier(
        eyebrow.start.x * flip,
        eyebrow.start.y + faceParams.eyebrowOuterCornerTilt,
        eyebrow.start.x * flip,
        eyebrow.start.y - faceParams.eyebrowCurve,
        eyebrow.end.x * flip,
        eyebrow.end.y - faceParams.eyebrowCurve,
        eyebrow.end.x * flip,
        eyebrow.end.y + faceParams.eyebrowInnerCornerTilt
      );
      endShape();

      this.createPupil(
        eyebrow.start.x * flip,
        eyebrow.end.x * flip,
        eyebrow.start.y,
        eyebrow.end.y + faceParams.eyebrowCurve * 2 + faceParams.eyeHeight * 0.5
      );
    }
  }

  overlayCircle() {
    fill(this.faceColor);
    ellipse(
      0,
      0,
      shapeParams.faceSize.value * breathingScale,
      shapeParams.faceSize.value * breathingScale
    );
  }

  nose() {
    function createNose(height, width) {
      triangle(
        -width * 0.5,
        -faceParams.eyeYPos + height,
        0,
        -faceParams.eyeYPos - height,
        width * 0.5,
        -faceParams.eyeYPos + height
      );
    }
    const noseHeight = this.noseHeight * breathingScale;
    fill(
      red(this.faceColor) - 30,
      green(this.faceColor) - 30,
      blue(this.faceColor) - 30
    );
    createNose(noseHeight, 15);
  }

  make() {
    this.overlayCircle();
    this.drawEyebrow({
      start: {
        x: -faceParams.eyeXPos - faceParams.eyeWidth - faceParams.eyeWidth,
        y: -shapeParams.faceSize.value * 0.25,
      },
      end: {
        x:
          -faceParams.eyeXPos +
          faceParams.eyeWidth -
          faceParams.eyeWidth -
          faceParams.eyeSpacing,
        y: -shapeParams.faceSize.value * 0.25,
      },
    });
    this.nose();
  }
}

function setup() {
  const container = select("#generative-art");
  const canvas = createCanvas(container.width, container.width);
  canvas.parent("generative-art");
  controllersContainer = select("#controllersContainer");
  createGUI();
}

function windowResized() {
  const container = select("#generative-art");
  resizeCanvas(container.width, container.height);
}

function draw() {
  clear();
  const container = select("#generative-art");
  background(`rgba(255, 255, 255, 0)`);

  mouseXInRange = constrain(mouseX, -container.width / 2, container.width / 2);
  mouseYInRange = constrain(
    mouseY,
    -container.height / 2,
    container.height / 2
  );

  translate(container.width / 2, container.height / 2);
  createRotatingShape();
  rotate(-rotationAngle);
  const face = new Face(shape, 0, 0);
  face.make();
}
