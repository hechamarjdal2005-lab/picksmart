// Converts the exact Stitch namedColors palette (hex) into HSL channel triplets
// so Tailwind can use `hsl(var(--token) / <alpha-value>)` (enables opacity modifiers
// + shadcn compatibility). Derived ONLY from imported/meta values — no invented colors.
import { writeFileSync } from "node:fs";

function hexToHslChannels(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  const H = Math.round(h * 360);
  const S = Math.round(s * 1000) / 10;
  const L = Math.round(l * 1000) / 10;
  return `${H} ${S}% ${L}%`;
}

// Exact Stitch palette from imported/meta/design-system.md (namedColors)
const palette = {
  surface: "#1d100a",
  "surface-dim": "#1d100a",
  "surface-bright": "#46362e",
  "surface-container-lowest": "#170b06",
  "surface-container-low": "#261812",
  "surface-container": "#2b1c16",
  "surface-container-high": "#362720",
  "surface-container-highest": "#41312a",
  "surface-variant": "#41312a",
  "on-surface": "#f8ddd2",
  "on-surface-variant": "#e2bfb0",
  "inverse-surface": "#f8ddd2",
  "inverse-on-surface": "#3d2d26",
  outline: "#a98a7d",
  "outline-variant": "#5a4136",
  "surface-tint": "#ffb693",
  primary: "#ffb693",
  "on-primary": "#561f00",
  "primary-container": "#ff6b00",
  "on-primary-container": "#572000",
  "inverse-primary": "#a04100",
  secondary: "#a9c7ff",
  "on-secondary": "#003063",
  "secondary-container": "#3a90ff",
  "on-secondary-container": "#002957",
  tertiary: "#9ccaff",
  "on-tertiary": "#003257",
  "tertiary-container": "#059eff",
  "on-tertiary-container": "#003357",
  error: "#ffb4ab",
  "on-error": "#690005",
  "error-container": "#93000a",
  "on-error-container": "#ffdad6",
  "primary-fixed": "#ffdbcc",
  "primary-fixed-dim": "#ffb693",
  "on-primary-fixed": "#351000",
  "on-primary-fixed-variant": "#7a3000",
  "secondary-fixed": "#d6e3ff",
  "secondary-fixed-dim": "#a9c7ff",
  "on-secondary-fixed": "#001b3d",
  "on-secondary-fixed-variant": "#00468b",
  "tertiary-fixed": "#d0e4ff",
  "tertiary-fixed-dim": "#9ccaff",
  "on-tertiary-fixed": "#001d35",
  "on-tertiary-fixed-variant": "#00497b",
  background: "#1d100a",
  "on-background": "#f8ddd2",
  // Functional colors used directly in Stitch markup (pros/cons/deal/white)
  success: "#22c55e", // green-500 used for Pros checkmarks
  "deal": "#ef4444", // red-500/red-600 Deal badges
  white: "#ffffff", // text-white on badges
};

let out = "";
for (const [name, hex] of Object.entries(palette)) {
  out += `    --${name}: ${hexToHslChannels(hex)}; /* ${hex} */\n`;
}
writeFileSync(new URL("./_tokens.generated.txt", import.meta.url), out);
console.log(out);
