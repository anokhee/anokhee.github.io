let params = {
  colorPalette: {
    sectionLabel: "Color Palette",
    hasDisplay: false,
    paletteTypes: ["solid", "gradient"],
    baseColors: {
      inputType: "palette",
      one: {
        r: 242,
        g: 87,
        b: 87,
        r2: 255,
        g2: 251,
        b2: 142,
      },
      two: {
        r: 240,
        g: 196,
        b: 66,
        r2: 124,
        g2: 18,
        b2: 186,
      },
      three: {
        r: 255,
        g: 241,
        b: 112,
        r2: 17,
        g2: 75,
        b2: 95,
      },
      four: {
        r: 17,
        g: 75,
        b: 95,
        r2: 250,
        g2: 219,
        b2: 198,
      },
      five: {
        r: 101,
        g: 101,
        b: 226,
        r2: 255,
        g2: 251,
        b2: 214,
      },
      six: {
        r: 238,
        g: 109,
        b: 197,
        r2: 157,
        g2: 133,
        b2: 108,
      },
      black: {
        r: 38,
        g: 39,
        b: 48,
        r2: 175,
        g2: 177,
        b2: 192,
      },
      white: {
        r: 255,
        g: 255,
        b: 255,
        r2: 91,
        g2: 182,
        b2: 22,
      },
    },
  },
  shape: {
    sectionLabel: "Cursor",
    hasDisplay: true,
    size: {
      inputType: "range-slider",
      label: "Size",
      value: 12,
      maxValue: 20,
      minValue: 0,
      step: 1,
      hasBool: false,
    },
    randomSeed: {
      inputType: "range-slider",
      label: "Randomize Size",
      value: 0,
      maxValue: 50,
      minValue: 0,
      step: 1,
      hasBool: true,
    },
    numDots: {
      inputType: "range-slider",
      label: "Number of Points",
      value: 15,
      maxValue: 20,
      minValue: 1,
      step: 1,
      hasBool: false,
    },
    roughness: {
      inputType: "range-slider",
      label: "Roughen",
      value: 0,
      maxValue: 30,
      minValue: 0,
      step: 1,
      hasBool: true,
    },
  },
  style: {
    sectionLabel: "Pen Style",
    hasDisplay: false,
    alpha: {
      inputType: "range-slider",
      label: "Alpha",
      value: 90,
      maxValue: 100,
      minValue: 0,
      step: 1,
      hasBool: false,
    },
    selectedColor: {
      r: 242,
      g: 87,
      b: 87,
      r2: 255,
      g2: 241,
      b2: 112,
      type: "solid",
    },
    lineWidth: {
      inputType: "range-slider",
      label: "Enable Outline",
      value: 0,
      maxValue: 10,
      minValue: 0,
      step: 1,
      hasBool: true,
    },
  },
};

let sidePanel = document.createElement("DIV");

function makeGUI(theObj, drawFunc) {
  let container = document.getElementById("home-canvas-control-panel");

  let allCursorStylesContainer = document.createElement("DIV");
  allCursorStylesContainer.id = "all-cursor-styles-container";

  let allPalettesContainer = document.createElement("DIV");

  sidePanel.id = "side-panel";
  sidePanel.style.position = "absolute";
  sidePanel.style.left = `${window.innerWidth * 0.68 - 245}px`;
  sidePanel.style.top = `${window.innerHeight * 0.5}px`;

  window.addEventListener("resize", function () {
    sidePanel.style.left = `${window.innerWidth * 0.68}px`;
  });

  // Dynamically creates GUI based on the object
  for (const eachSection in theObj) {
    let section = theObj[eachSection];
    let sectionContainer = document.createElement("DIV");
    sectionContainer.className = "section-container";

    let sectionLabelContainer = document.createElement("DIV");
    sectionLabelContainer.className = "section-label-container";

    let sectionLabel = document.createElement("H6");
    sectionLabel.className = "section-label";
    sectionLabel.innerHTML = section.sectionLabel;

    let exitButton = document.createElement("H6");
    exitButton.className = "exit-button";
    exitButton.innerHTML = "(esc)";

    sectionLabelContainer.appendChild(sectionLabel);
    sectionLabelContainer.appendChild(exitButton);

    let cursorDisplayContainer = document.createElement("DIV");
    cursorDisplayContainer.id = "cursor-display-container";

    container.appendChild(cursorDisplayContainer);
    container.appendChild(sidePanel);

    // Creates a display window, if it applies
    let checkForDisplay = section.hasDisplay;
    let displayWindow;
    let mainPanel;

    if (checkForDisplay == true && checkForDisplay != undefined) {
      displayWindow = document.createElement("CANVAS");
      displayWindow.width = `100px`;
      displayWindow.height = `100px`;
      sectionContainer.appendChild(displayWindow);
      displayWindow.id = "displayWindow";
    } else if (checkForDisplay == false && checkForDisplay != undefined) {
      mainPanel = document.createElement("DIV");
      mainPanel.id = "main-panel";
    }

    let cursorStyleInputsContainer = document.createElement("DIV");
    cursorStyleInputsContainer.className = "cursor-style-inputs-container";

    // Creates a container to hold all the cursor shape inputs
    let cursorShapeInputsContainer = document.createElement("DIV");
    cursorShapeInputsContainer.className = "cursor-shape-inputs-container";
    cursorShapeInputsContainer.appendChild(sectionLabelContainer);

    for (const variable in section) {
      let inputValueExists = section[variable].value;
      let inputType = section[variable].inputType;

      if (inputType === "range-slider" && inputValueExists != undefined) {
        let inputContainer = document.createElement("DIV");
        inputContainer.className = "input-container";

        // Creates a checkbox for each option
        let checkbox = document.createElement("INPUT");
        checkbox.className = "checkbox";
        checkbox.setAttribute("type", "checkbox");

        // Creates a container to hold both the input label and a checkbox, if both exist
        let inputLabelContainer = document.createElement("DIV");
        inputLabelContainer.className = "input-label-container";

        // Creates a label for each individual range slider
        let inputLabel = document.createElement("LABEL");
        inputLabel.className = "input-label";
        inputLabel.innerHTML = section[variable].label;
        if (!checkbox.checked && section[variable].hasBool) {
          inputLabel.style.opacity = 0.25;
        } else {
          inputLabel.style.opacity = 1;
        }

        // Creates a range slider for each parameter
        let rangeSlider = document.createElement("INPUT");
        rangeSlider.className = "range-slider";
        rangeSlider.setAttribute("type", "range");
        rangeSlider.defaultValue = section[variable].value;
        rangeSlider.setAttribute("min", section[variable].minValue);
        rangeSlider.setAttribute("max", section[variable].maxValue);

        // Redraws the canvas when the range slider value is changed
        rangeSlider.addEventListener("input", function () {
          drawFunc;
          section[variable].value = this.value;
        });

        inputLabelContainer.appendChild(inputLabel);

        // Appends the checkbox to the controllers panel, if hasBool is true
        if (section[variable].hasBool == true) {
          if (inputType === "range-slider") {
            rangeSlider.disabled = true;
          }
          inputLabelContainer.appendChild(checkbox);
          checkbox.checked = false;
        }

        // If the checkbox exists, this function controls what happens to the range slider
        // when it is checked & unchecked
        checkbox.addEventListener("input", function () {
          if (checkbox.checked) {
            rangeSlider.disabled = false;
            section[variable].value = rangeSlider.value;
            inputLabel.style.opacity = 1;
          } else if (!checkbox.checked) {
            rangeSlider.disabled = true;
            section[variable].value = 0;
            inputLabel.style.opacity = 0.25;
          }
        });

        inputContainer.appendChild(inputLabelContainer);
        inputContainer.appendChild(rangeSlider);

        if (checkForDisplay) {
          cursorShapeInputsContainer.appendChild(inputContainer);
          cursorDisplayContainer.appendChild(sectionContainer);
          allCursorStylesContainer.appendChild(cursorDisplayContainer);
          sidePanel.appendChild(cursorShapeInputsContainer);
        }
        if (checkForDisplay == false && checkForDisplay != undefined) {
          mainPanel.appendChild(inputContainer);
          allCursorStylesContainer.appendChild(mainPanel);
        }

        container.appendChild(allCursorStylesContainer);
      } else if (inputType === "palette" && inputValueExists === undefined) {
        let paletteTypes = section.paletteTypes;

        for (const eachPalette in paletteTypes) {
          let paletteContainer = document.createElement("DIV");
          paletteContainer.className = "palette-container";

          for (const eachColor in section.baseColors) {
            if (eachColor != "inputType") {
              let paletteType = section.paletteTypes[eachPalette];
              let colorSwatch = document.createElement("DIV");
              let rgb = section.baseColors[eachColor];

              colorSwatch.className = "color-swatch";
              if (paletteType === "solid") {
                colorSwatch.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
              } else if (paletteType === "gradient") {
                colorSwatch.style.background = `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}), rgba(${rgb.r2}, ${rgb.g2}, ${rgb.b2}))`;
              }

              colorSwatch.addEventListener("click", function () {
                if (paletteType === "solid") {
                  params.style.selectedColor = {
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b,
                    r2: rgb.r2,
                    g2: rgb.g2,
                    b2: rgb.b2,
                    type: "solid",
                  };
                } else if (paletteType === "gradient") {
                  params.style.selectedColor = {
                    r: rgb.r,
                    g: rgb.g,
                    b: rgb.b,
                    r2: rgb.r2,
                    g2: rgb.g2,
                    b2: rgb.b2,
                    type: "gradient",
                  };
                }
              });

              paletteContainer.appendChild(colorSwatch);
            }
          }

          allPalettesContainer.appendChild(paletteContainer);
        }
        sectionContainer.appendChild(allPalettesContainer);
        container.appendChild(sectionContainer);
      }
    }

    if (checkForDisplay) {
      displayWindow.addEventListener(
        "click",
        function (e) {
          cursorShapeInputsContainer.style.display = "block";
          e.stopPropagation(); //this is important! If removed, you'll get both alerts
        },
        false
      );
    }
  }
}
