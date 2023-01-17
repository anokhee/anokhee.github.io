let params = {
  isJoined: {
    sectionLabel: "Shape Type",
    inputType: "checkbox",
  },
  size: {
    sectionLabel: "Cursor Size",
    base: {
      inputType: "range-slider",
      label: "Size",
      value: 5,
      maxValue: 10,
      minValue: 0,
      step: 1,
      hasBool: false,
    },
    randomSeed: {
      inputType: "range-slider",
      label: "Randomness",
      value: 0,
      maxValue: 10,
      minValue: 0,
      step: 1,
      hasBool: true,
    },
  },
  shape: {
    sectionLabel: "Cursor Shape",
    numDots: {
      inputType: "range-slider",
      label: "# of Points",
      value: 5,
      maxValue: 12,
      minValue: 1,
      step: 1,
      hasBool: false,
    },
    roughness: {
      inputType: "range-slider",
      label: "Roughness",
      value: 0,
      maxValue: 10,
      minValue: 0,
      step: 1,
      hasBool: true,
    },
  },
  style: {
    sectionLabel: "Pen Style",
    alpha: {
      inputType: "range-slider",
      label: "Alpha",
      value: 1,
      maxValue: 100,
      minValue: 0,
      step: 1,
      hasBool: false,
    },
    colors: {
      red: {
        r: 242,
        g: 87,
        b: 87,
      },
      orange: {
        r: 242,
        g: 205,
        b: 96,
      },
      yellow: {
        r: 242,
        g: 232,
        b: 99,
      },
      green: {
        r: 141,
        g: 159,
        b: 127,
      },
      blue: {
        r: 31,
        g: 13,
        b: 255,
      },
      purple: {
        r: 252,
        g: 18,
        b: 189,
      },
      black: {
        r: 38,
        g: 39,
        b: 48,
      },
      white: {
        r: 255,
        g: 255,
        b: 255,
      },
    },
  },
};

const init = () => {
  canvas = document.getElementById("myCanvas");
  c = canvas.getContext("2d");

  class PaintSplatter {
    constructor(x, y, size, numDots, color) {
      this.x = x;
      this.y = y;

      this.randomSeed = params.size.randomSeed.value;
      if (this.randomSeed != 0) {
        this.size = size * Math.random() * params.size.randomSeed.value;
      } else {
        this.size = size;
      }

      this.color = color;
      this.numDots = numDots;
      this.roughness = params.shape.roughness.value;
      this.alpha = params.style.alpha.value * 0.01;
    }

    make() {
      let arc = (Math.PI * 2) / this.numDots;
      let ang = 0;

      c.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
      c.opacity = 0.5;

      c.beginPath();
      for (let i = 0; i < this.numDots; i++) {
        let radius = this.size + Math.random() * this.roughness;
        let x = radius * Math.cos(ang) + this.x / 2;
        let y = radius * Math.sin(ang) + this.y / 2;

        c.lineTo(x * 2, y * 2);

        ang += arc;
      }
      c.closePath();
      c.stroke();

      c.strokeStyle = "rgba(0, 0, 255)";
      c.fillStyle = "linear-gradient(#e66465, #9198e5);";
      c.stroke();
      c.fill();
    }
  }

  const setBackground = (color) => {
    c.beginPath();
    c.rect(0, 0, w, h);
    c.fillStyle = color;
    c.fill();
  };

  const resize = () => {
    canvas.width = w = window.innerWidth * 0.78;
    canvas.height = h = window.innerHeight;
    window.requestAnimationFrame(draw);

    console.log(`screen resolution: ${w}px × ${h}px`);
  };

  const makeGUI = (parameters) => {
    let params = parameters;
    container = document.getElementById("hero-canvas-controls");

    for (const section in params) {
      let sectionContainer = document.createElement("DIV");
      sectionContainer.className = "section-container";
      let sectionLabel = document.createElement("H6");
      sectionLabel.innerHTML = params[section].sectionLabel;

      sectionContainer.appendChild(sectionLabel);
      container.appendChild(sectionContainer);

      for (const variable in params[section]) {
        let inputValueExists = params[section][variable].value;
        let inputType = params[section][variable].inputType;

        // Creates a container to hold the label & input
        let inputContainer = document.createElement("DIV");
        inputContainer.className = "input-container";

        // Creates a checkbox for each option
        let checkbox = document.createElement("INPUT");
        checkbox.className = "checkbox";
        checkbox.setAttribute("type", "checkbox");

        // Creates a label for each individual range slider
        let inputLabel = document.createElement("LABEL");
        inputLabel.className = "input-label";
        inputLabel.innerHTML = params[section][variable].label;

        if (inputType === "range-slider" && inputValueExists != undefined) {
          // Creates a range slider for each parameter
          let rangeSlider = document.createElement("INPUT");
          rangeSlider.className = "range-slider";
          rangeSlider.setAttribute("type", "range");
          rangeSlider.defaultValue = params[section][variable].value;
          rangeSlider.setAttribute("min", params[section][variable].minValue);
          rangeSlider.setAttribute("max", params[section][variable].maxValue);

          // Redraws the canvas when the input is changed
          rangeSlider.addEventListener("input", function () {
            draw();
            params[section][variable].value = this.value;
          });

          // Appends the checkbox to the controllers panel if hasBool is true
          if (params[section][variable].hasBool == true) {
            if (inputType === "range-slider") {
              rangeSlider.disabled = true;
            }
            inputContainer.appendChild(checkbox);
            checkbox.checked = false;
          }

          // If the checkbox exists, this function controls what happens to the range slider
          // when it is checked & unchecked
          checkbox.addEventListener("input", function () {
            if (checkbox.checked == true) {
              rangeSlider.disabled = false;
              params[section][variable].value = rangeSlider.value;
            } else if (checkbox.checked == false) {
              rangeSlider.disabled = true;
              params[section][variable].value = 0;
            }
          });

          inputContainer.appendChild(inputLabel);
          inputContainer.appendChild(rangeSlider);
          sectionContainer.appendChild(inputContainer);
        } else if (inputType === "checkbox" && inputValueExists === undefined) {
        }
      }
    }
  };

  const setup = () => {
    console.log("setup completed");
    makeGUI(params);
  };

  const draw = (t) => {
    document.onmousemove = function getMouseXY(e) {
      setBackground(`rgba(255, 255, 255, .01)`);
      let current = new PaintSplatter(
        e.clientX,
        e.clientY,
        params.size.base.value,
        params.shape.numDots.value,
        params.style.colors.green
      );
      current.make();
    };

    canvas.addEventListener("click", function () {
      t = 0;
      c.clearRect(0, 0, canvas.width, canvas.height);
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
