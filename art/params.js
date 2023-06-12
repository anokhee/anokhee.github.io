let shapeParams = {
  shapeType: {
    value: "flower",
    type: "button-set",
    arr: ["flower", "polygon", "star"],
  },
  numSides: {
    value: Math.floor(Math.random() * (20 - 3) +),
    type: "number",
    icon: "./art/icons/numSides-icon.svg",
    range: { min: 3, max: 25, step: 1 },
  },
  faceSize: {
    value: Math.random() * (180 - 50) + 50,
    // type: "number",
    icon: "./art/icons/faceSize-icon.svg",
    range: { min: 0, max: 110, step: 1 },
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
    label: "Face Color",
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
  outerSize: {
    value: Math.random() * (160 - 100) + 100,
    // type: "slider",
    label: "Outer Color",
    range: { min: 0, max: 170, step: 1 },
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
