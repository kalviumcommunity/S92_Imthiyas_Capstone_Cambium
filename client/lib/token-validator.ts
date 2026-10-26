/**
 * Cambium Living Materials Design System — Token & Contrast Validator
 * WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text) and APCA Readability Engine
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a hex color string to RGB components.
 * Supports #rgb and #rrggbb formats.
 */
export function hexToRgb(hex: string): RgbColor {
  let cleanHex = hex.replace(/^#/, '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) {
    throw new Error(`Invalid hex color string: ${hex}`);
  }

  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) {
    throw new Error(`Invalid hex digits in: ${hex}`);
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates relative luminance according to W3C WCAG 2.1 / 2.2 specifications.
 * Luminance is scaled from 0 (black) to 1 (white).
 */
export function calculateRelativeLuminance(rgb: RgbColor): number {
  const normalize = (val: number): number => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const R = normalize(rgb.r);
  const G = normalize(rgb.g);
  const B = normalize(rgb.b);

  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates WCAG 2.2 contrast ratio between two colors: (L1 + 0.05) / (L2 + 0.05).
 * Always returns a ratio >= 1.0 (max 21.0).
 */
export function calculateContrastRatio(hexForeground: string, hexBackground: string): number {
  const lum1 = calculateRelativeLuminance(hexToRgb(hexForeground));
  const lum2 = calculateRelativeLuminance(hexToRgb(hexBackground));

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Number(ratio.toFixed(2));
}

/**
 * Validates whether two colors pass WCAG 2.2 AA standards.
 * - Normal text requires >= 4.5:1
 * - Large text (>= 18pt or bold >= 14pt) requires >= 3.0:1
 */
export function passesWcagAA(
  hexForeground: string,
  hexBackground: string,
  isLargeText = false
): boolean {
  const ratio = calculateContrastRatio(hexForeground, hexBackground);
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Calculates approximate APCA Lightness Contrast (Lc) value between text and background.
 * Returns signed Lc value (positive for dark on light, negative for light on dark).
 */
export function calculateApcaLc(hexText: string, hexBg: string): number {
  const yText = calculateRelativeLuminance(hexToRgb(hexText));
  const yBg = calculateRelativeLuminance(hexToRgb(hexBg));

  // Simplified APCA power curves
  const normText = Math.pow(yText, 0.56);
  const normBg = Math.pow(yBg, 0.65);

  const deltaY = normBg - normText;
  const lc = deltaY * 100;
  return Number(lc.toFixed(1));
}
