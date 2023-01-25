const init = () => {
  const canvas = document.getElementById("myCanvas");
  c = canvas.getContext("2d");

  let pathsArr;

  class Shape {
    constructor(points) {
      this.points = points;
    }

    make() {
      console.log(this.points.length);
      c.beginPath();
      for (let i = 1; i < this.points.length; i++) {
        let x =
          this.points[i][0] + Math.random() * params.shape.roughness.value;
        let y =
          this.points[i][1] + Math.random() * params.shape.roughness.value;
        c.quadraticCurveTo(
          this.points[i - 1][0],
          this.points[i - 1][1],
          this.points[i][0],
          this.points[i][1]
        );
      }
      c.quadraticCurveTo(
        this.points[this.points.length - 1][0],
        this.points[this.points.length - 1][1],
        this.points[0][0],
        this.points[0][1]
      );
      c.lineTo(this.points[0][0], this.points[0][1]);
      c.stroke();
      c.fillStyle = `rgba(${params.style.selectedColor})`;
      c.fill();
      c.closePath();
    }
  }

  class PaintSplatter {
    constructor(
      x,
      y,
      size,
      numDots,
      colorType,
      color,
      alpha,
      lineWidth,
      lineMode
    ) {
      this.x = x;
      this.y = y;

      this.randomSeed = params.shape.randomSeed.value;
      if (this.randomSeed != 0) {
        this.size = size * Math.random() * params.shape.randomSeed.value;
      } else {
        this.size = size;
      }

      this.numDots = numDots;
      this.roughness = params.shape.roughness.value;
      this.lineMode = lineMode;

      this.lineWidth = lineWidth;
      if (this.lineWidth != 0) {
        c.strokeStyle = `rgba(${params.style.selectedColor.r - 100},
          ${params.style.selectedColor.g - 100}, ${
          params.style.selectedColor.b - 100
        }, 1)`;
      } else {
        c.strokeStyle = `rgba(0, 0, 0, 0)`;
      }

      this.alpha = alpha * 0.01;
      this.color = getColor(
        colorType,
        color,
        this.alpha,
        this.x,
        this.y,
        this.size
      );
    }

    make() {
      let arc = (Math.PI * 2) / this.numDots;
      let ang = 0;

      c.lineWidth = this.lineWidth;
      c.fillStyle = this.color;

      if (this.lineMode === "polygon") {
        c.beginPath();
        for (let i = 0; i < this.numDots; i++) {
          let radius = this.size + Math.random() * this.roughness;
          let x = radius * Math.cos(ang) + this.x;
          let y = radius * Math.sin(ang) + this.y;
          c.lineTo(x, y);
          ang += arc;
        }
        c.fill();
        c.closePath();
      }

      if (this.lineMode === "dots") {
        for (let i = 0; i < this.numDots; i++) {
          let radius = this.size + Math.random() * this.roughness;
          let x = radius * Math.cos(ang) + this.x;
          let y = radius * Math.sin(ang) + this.y;
          c.beginPath();
          c.rect(x, y, 2, 2, 5);
          c.stroke();
          ang += arc;
        }
      }

      if (this.lineMode === "dots") {
        for (let i = 0; i < this.numDots; i++) {
          let radius = this.size + Math.random() * this.roughness;
          let x = radius * Math.cos(ang) + this.x;
          let y = radius * Math.sin(ang) + this.y;
          c.beginPath();
          c.rect(x, y, 5, 5);
          ang += arc;
        }
      }
      c.stroke();

      console.log(this.lineMode);
    }
  }

  let getColor = (colorType, color, alpha, x, y, size) => {
    if (colorType === "solid") {
      return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    } else {
      return createGradientFill(color, alpha, x, y, size);
    }
  };

  const createGradientFill = (color, alpha, x, y, size) => {
    let gradient = c.createLinearGradient(size, size, x * 1.5, y * 1.5);
    gradient.addColorStop(
      0,
      `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
    );
    gradient.addColorStop(
      1,
      `rgba(${color.r2}, ${color.g2}, ${color.b2}, ${alpha})`
    );
    return gradient;
  };

  const setBackground = (color) => {
    c.beginPath();
    c.rect(0, 0, w, h);
    c.fillStyle = color;
    c.fill();
  };

  let resize = () => {
    canvas.width = w = window.innerWidth * 0.68;
    canvas.height = h = window.innerHeight;
    window.requestAnimationFrame(draw);
    console.log(`screen resolution: ${w}px × ${h}px`);
  };

  const setup = () => {
    console.log("setup completed");
    makeGUI(params, draw(), resize(), w, h);
  };

  const draw = (t) => {
    canvas.style.background = "#fff";
    document.onmousemove = function getMouseXY(e) {
      setBackground(`rgba(255, 255, 255, .0005)`);
      let current = new PaintSplatter(
        e.clientX,
        e.clientY,
        params.shape.size.value,
        params.shape.numDots.value,
        params.style.selectedColor.type,
        params.style.selectedColor,
        params.style.alpha.value,
        params.style.lineWidth.value,
        params.style.selectedLineMode
      );
      if (e.which == 1) {
        current.make();
        pathsArr.push([e.clientX, e.clientY]);

        if (
          params.style.selectedDrawMode === "fill" &&
          params.style.selectedDrawMode != "paintbrush"
        ) {
          document.onmouseup = function (e) {
            let shape = new Shape(pathsArr);
            shape.make();
            pathsArr = [];
          };
        }
      }
    };
    pathsArr = [];

    t++;

    document.addEventListener("keydown", function (e) {
      if (e.keyCode === 32) {
        t = 0;
        c.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  };

  let w,
    h,
    last,
    i = 0,
    start = 0;

  window.requestAnimationFrame(draw, 1);
  window.removeEventListener("load", init);
  window.addEventListener("resize", resize);
  resize();
  setup();
};

window.addEventListener("load", init);
