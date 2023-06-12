let shapeParams = {
  shapeType: {
    value: "flower",
    type: "button-set",
    arr: ["flower", "polygon", "star"],
  },
  numSides: {
    value: 8,
    type: "number",
    icon: "./art/icons/numSides-icon.svg",
    range: { min: 3, max: 25, step: 1 },
  },
  faceSize: {
    value: Math.random() * (180 - 60) + 60,
    // type: "number",
    icon: "./art/icons/faceSize-icon.svg",
    range: { min: 0, max: 110, step: 1 },
  },
  outerSize: {
    value: Math.random() * (200 - 100) + 100,
    // type: "small-slider",
    label: "Outer Color",
    range: { min: 0, max: 170, step: 1 },
  },
  shapeColor: {
    value: "#F94E56",
    type: "palette",
    label: "Shape Color",
    arr: [
      "#ffffff",
      "#F94E56",
      "#FA9EC1",
      "#FFD166",
      "#3AB795",
      "#6BCADB",
      "#72ACFD",
      "#B54098",
    ],
  },
  faceColor: {
    value: "#C3B091",
    type: "palette",
    label: "Skin Tone",
    arr: [
      "#FFE8D9",
      "#F8C8A6",
      "#DFCEBE",
      "#CEC6BB",
      "#B57575",
      "#A35D43",
      "#7D5D4F",
      "#564141",
    ],
  },
  intensity: {
    value: 0.01,
    type: "slider",
    label: "intensity",
    range: { min: 0.005, max: 0.05, step: 0.00001 },
  },
};

let faceParams = {
  eyeXPos: 0.25,
  eyeYPos: 3,
  eyeWidth: 20,
  eyeHeight: 20,
  eyebrowCurve: 10,
  eyebrowInnerCornerTilt: -10,
  eyebrowOuterCornerTilt: 0,
  eyeSpacing: 5,
};

function createGUI() {
  controllersContainer.html("");
  const shapeParamsContainer = createDiv();
  shapeParamsContainer.addClass("shape-params-container");

  for (const param in shapeParams) {
    const { type, label, arr, value, range } = shapeParams[param];

    if (type === "button-set" || type === "number") {
      shapeParamsContainer.parent(controllersContainer);
      if (type === "button-set") {
        const buttonSetContainer = createDiv().addClass("button-set-container");
        buttonSetContainer.parent(controllersContainer);

        const shapeButtonsContainer = createDiv().addClass(
          "shape-buttons-container"
        );
        shapeButtonsContainer.parent(buttonSetContainer);

        for (const shape of arr) {
          const shapeButton = createButton("");
          shapeButton.addClass("shape-button");
          shapeButton.parent(buttonSetContainer);
          buttonSetContainer.parent(shapeParamsContainer);

          // Add SVG image based on shape type
          if (shape === "flower") {
            shapeButton.html(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.92 51.92">
                <defs>
                  <filter id="inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feOffset dx="-6" dy="6" />
                    <feGaussianBlur stdDeviation="0" result="shadow" />
                    <feFlood flood-color="rgba(0, 0, 0, 1)" result="shadowColor" />
                    <feComposite in="shadowColor" in2="shadow" operator="in" result="shadowFilled" />
                    <feComposite in="SourceGraphic" in2="shadowFilled" operator="over" />
                  </filter>
                  
                </defs>
                <path fill="#FA9EC1" stroke="#231F20" stroke-miterlimit="10" d="M54.71,29.5h-3l2.14-2.14a6.65,6.65,0,0,0,.71-8.75A6.49,6.49,0,0,0,44.81,18L42.5,20.31v-3a6.67,6.67,0,0,0-5.69-6.7A6.5,6.5,0,0,0,29.5,17v3.27l-2.13-2.14a6.67,6.67,0,0,0-8.76-.71A6.49,6.49,0,0,0,18,27.19l2.31,2.31h-3a6.67,6.67,0,0,0-6.7,5.69A6.5,6.5,0,0,0,17,42.5h3.27l-2.14,2.13a6.67,6.67,0,0,0-.71,8.76,6.49,6.49,0,0,0,9.73.61l2.31-2.31v3a6.67,6.67,0,0,0,5.69,6.7A6.5,6.5,0,0,0,42.5,55V51.69l2.13,2.14a6.67,6.67,0,0,0,8.76.71A6.49,6.49,0,0,0,54,44.81L51.69,42.5H55a6.5,6.5,0,0,0,6.45-7.31A6.67,6.67,0,0,0,54.71,29.5Z" transform="translate(-8.04 -12.04)" filter="url(#inner-shadow)"/>
              </svg>
            `);
          }

          if (shape === "polygon") {
            shapeButton.html(`
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53.62 53.62">
                <polygon fill="#72ACFD" stroke="#231F20" stroke-miterlimit="10" points="26.81 1.12 0.81 53.12 52.81 53.12 26.81 1.12" transform="translate(2 -2)"  filter="url(#inner-shadow)"/>
              </svg>
            `);
          } else if (shape === "star") {
            shapeButton.html(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.07 57.11"><defs><style>.cls-1{fill:#ffd166;stroke:#231f20;stroke-miterlimit:10;}</style></defs><polygon class="cls-1" points="28.54 1.18 37.03 19.28 56.04 22.18 42.29 36.28 45.53 56.18 28.54 46.78 11.54 56.18 14.79 36.28 1.04 22.18 20.04 19.28 28.54 1.18" transform="translate(2 -2)"  filter="url(#inner-shadow)" /></svg>
            `);
          }

          shapeButton.mousePressed(() => {
            shapeParams[param].value = shape;
            const siblings =
              shapeButtonsContainer.elt.getElementsByClassName("shape-button");
            for (let i = 0; i < siblings.length; i++) {
              siblings[i].classList.remove("selected-shape");
            }
            shapeButton.addClass("selected-shape");
          });
        }
      }
      if (type === "number") {
        const numberContainer = createDiv();
        numberContainer.addClass("number-container");
        const icon = createImg(shapeParams[param].icon);
        const numberInput = createInput(shapeParams[param].value, "number");
        icon.parent(numberContainer);
        numberInput.parent(numberContainer);
        numberContainer.parent(shapeParamsContainer);
        numberInput.input(() => {
          shapeParams[param].value = numberInput.value();
        });
      }
    }

    if (type === "palette") {
      const paletteContainer = createDiv().addClass("palette-container");
      paletteContainer.parent(controllersContainer);

      const labelContainer = createDiv();
      labelContainer.parent(paletteContainer);
      createElement("p", label).parent(labelContainer);

      const swatchContainer = createDiv().addClass("color-swatch-container");
      swatchContainer.parent(paletteContainer);

      for (const color of arr) {
        const swatch = createDiv()
          .style("background-color", color)
          .addClass("color-swatch");
        swatch.parent(swatchContainer);
        swatch.mousePressed(() => {
          shapeParams[param].value = color;
          const siblings =
            paletteContainer.elt.getElementsByClassName("color-swatch");
          for (let i = 0; i < siblings.length; i++) {
            siblings[i].classList.remove("selected-color");
          }
          swatch.addClass("selected-color");
        });
      }
    }
    if (type === "slider") {
      const sliderContainer = createDiv().addClass("slider-container");
      sliderContainer.parent(controllersContainer);

      const labelContainer = createDiv();
      labelContainer.parent(sliderContainer);
      createElement("p", label).parent(labelContainer);

      const slider = createSlider(
        range.min,
        range.max,
        value,
        range.step
      ).addClass("range-slider");
      slider.parent(sliderContainer);
      slider.input(() => {
        shapeParams[param].value = slider.value();
      });
    }
  }
}
