function parseColor(color) {
  let rgb;

  // If the color is in RGB or RGBA format
  if (color.startsWith("rgb")) {
    rgb = color.match(/\d+/g).map(Number);
  }
  // If the color is in Hex format
  else if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    rgb = [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  // If the color is in HSL format, convert to RGB
  else if (color.startsWith("hsl")) {
    const hsl = color.match(
      /(\d+\.?\d*)%?\s*,\s*(\d+\.?\d*)%?\s*,\s*(\d+\.?\d*)%?/,
    );
    let h = parseFloat(hsl[1]);
    let s = parseFloat(hsl[2]) / 100;
    let l = parseFloat(hsl[3]) / 100;

    // HSL to RGB conversion
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let rgbTemp;
    if (h >= 0 && h < 60) rgbTemp = [c, x, 0];
    else if (h >= 60 && h < 120) rgbTemp = [x, c, 0];
    else if (h >= 120 && h < 180) rgbTemp = [0, c, x];
    else if (h >= 180 && h < 240) rgbTemp = [0, x, c];
    else if (h >= 240 && h < 300) rgbTemp = [x, 0, c];
    else rgbTemp = [c, 0, x];

    rgb = rgbTemp.map((val) => Math.round((val + m) * 255));
  }

  return rgb;
}

export const getContrastColor = (backgroundColor) => {
  const rgb = parseColor(backgroundColor);

  if (!rgb) return "black"; // Fallback if parsing fails

  // Calculate luminance based on RGB values
  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];

  // Return black or white based on luminance
  return luminance > 128 ? "black" : "white";
};
