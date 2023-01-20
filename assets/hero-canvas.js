const init = () => {
  const canvas = document.getElementById("myCanvas");
  c = canvas.getContext("2d");

  class PaintSplatter {
    constructor(x, y, size, numDots, colorType, color, alpha, lineWidth) {
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
      console.log(color);
    }

    make() {
      let arc = (Math.PI * 2) / this.numDots;
      let ang = 0;

      c.lineWidth = this.lineWidth;
      c.fillStyle = this.color;

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
      c.stroke();
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
    console.log(color);
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
      if (e.which == 1) {
        setBackground(`rgba(255, 255, 255, .001)`);
        let current = new PaintSplatter(
          e.clientX,
          e.clientY,
          params.shape.size.value,
          params.shape.numDots.value,
          params.style.selectedColor.type,
          params.style.selectedColor,
          params.style.alpha.value,
          params.style.lineWidth.value
        );
        current.make();
      }
    };
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
