const CONFIG = {
  palettes: COLORPALETTES,
  chimeLength: 150,
  mouseRadius: 30,
  isRotating: true,
  rotationSpeedDivisor: 3000,
  gravity: 9.8,
  shapeTypes: ["polygon", "star", "flower"],
  chimeBaseRadius: {
    width: 120,
    height: 3,
  },
};

const PENDULUM = {
  numStrings: { min: 10, max: 50 },
  stringLength: { min: 10, max: 350 },
  mass: { min: 5, max: 40 },
  velocityDamping: { min: 0.9, max: 0.91 },
};

function pickRandomPaletteAndBackground() {
  const paletteNames = Object.keys(CONFIG.palettes);

  if (paletteNames.length === 0) {
    console.error("No palettes found in CONFIG.palettes");
    return {
      selectedPalette: null,
      backgroundColor: { r: 0, g: 0, b: 0 }, // default black
    };
  }

  const randomPaletteName =
    paletteNames[Math.floor(Math.random() * paletteNames.length)];
  const selectedPalette = CONFIG.palettes[randomPaletteName];

  if (
    !selectedPalette ||
    typeof selectedPalette !== "object" ||
    !selectedPalette.lightest ||
    !selectedPalette.darkest
  ) {
    console.error("Selected palette missing required colors", selectedPalette);
    return {
      selectedPalette: null,
      backgroundColor: { r: 0, g: 0, b: 0 }, // fallback black
    };
  }

  // Pick lightest or darkest for background randomly
  const backgroundColor =
    Math.random() < 0.5 ? selectedPalette.lightest : selectedPalette.darkest;

  return { selectedPalette, backgroundColor };
}

// Usage
const { selectedPalette, backgroundColor } = pickRandomPaletteAndBackground();
