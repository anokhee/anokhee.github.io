let faceSize = Math.random() * (140 - 60) + 60;
let shapeTypesArr = ["flower", "polygon", "star"];
let shapeColorArr = [
  "#ffffff",
  "#F94E56",
  "#FA9EC1",
  "#FFD166",
  "#3AB795",
  "#6BCADB",
  "#72ACFD",
  "#B54098",
];
let skinTonesArr = [
  "#FFE8D9",
  "#F8C8A6",
  "#DFCEBE",
  "#CEC6BB",
  "#B57575",
  "#A35D43",
  "#7D5D4F",
  "#564141",
];
let eyeHeight = Math.random() * (20 - 8) + 8;

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

let shapeParams = {
  shapeType: {
    value: shapeTypesArr[Math.floor(Math.random() * shapeTypesArr.length)],
    type: "button-set",
    arr: shapeTypesArr,
  },
  numSides: {
    value: Math.floor(Math.random() * (20 - 3) + 3),
    type: "number",
    icon: "./art/icons/numSides-icon.svg",
    range: { min: 3, max: 25, step: 1 },
  },
  faceSize: {
    value: faceSize,
    // type: "number",
    icon: "./art/icons/faceSize-icon.svg",
    range: { min: 0, max: 110, step: 1 },
  },
  outerSize: {
    value: Math.random() * (faceSize * 2 - faceSize * 1.1) + faceSize * 1.1,
    // type: "small-slider",
    label: "Outer Color",
    range: { min: 0, max: 170, step: 1 },
  },
  shapeColor: {
    value: shapeColorArr[Math.floor(Math.random() * shapeColorArr.length)],
    type: "palette",
    label: "Shape Color",
    arr: shapeColorArr,
  },
  faceColor: {
    value: skinTonesArr[Math.floor(Math.random() * skinTonesArr.length)],
    type: "palette",
    label: "Skin Tone",
    arr: skinTonesArr,
  },
  intensity: {
    value: Math.random() * (0.02 - 0.005) + 0.005,
    type: "slider",
    label: "intensity",
    range: { min: 0.005, max: 0.05, step: 0.00001 },
  },
};
