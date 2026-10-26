import {
  hexToRgb,
  calculateRelativeLuminance,
  calculateContrastRatio,
  passesWcagAA,
  calculateApcaLc,
} from '../../client/lib/token-validator';

describe('Suite 03: Living Materials Design System Token & Contrast Validator', () => {
  // Authoritative tokens from tokens/cambium.tokens.json
  const TOKENS = {
    forestInk: '#202920',
    parchment: '#FAF7F0',
    mineralSand: '#F2EBDD',
    canopy: '#3E6248',
    deepMoss: '#293E30',
    livingAlgaeAccessible: '#365F42',
    pureWhite: '#FFFFFF',
    pureBlack: '#000000',
  };

  describe('Hex Parsing & Luminance Engine', () => {
    it('should parse 6-digit and 3-digit hex colors into RGB components', () => {
      expect(hexToRgb('#FAF7F0')).toEqual({ r: 250, g: 247, b: 240 });
      expect(hexToRgb('#202920')).toEqual({ r: 32, g: 41, b: 32 });
      expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should throw an error for malformed hex strings', () => {
      expect(() => hexToRgb('not-a-hex')).toThrow('Invalid hex color string');
      expect(() => hexToRgb('#12345')).toThrow('Invalid hex color string');
      expect(() => hexToRgb('#GGGGGG')).toThrow('Invalid hex digits');
    });

    it('should calculate accurate relative luminance according to W3C formula', () => {
      const lumWhite = calculateRelativeLuminance({ r: 255, g: 255, b: 255 });
      const lumBlack = calculateRelativeLuminance({ r: 0, g: 0, b: 0 });

      expect(lumWhite).toBeCloseTo(1.0, 4);
      expect(lumBlack).toBeCloseTo(0.0, 4);

      const lumParchment = calculateRelativeLuminance(hexToRgb(TOKENS.parchment));
      expect(lumParchment).toBeGreaterThan(0.9); // Light parchment background
    });
  });

  describe('WCAG 2.2 Level AA Compliance Verifications', () => {
    it('should verify Forest Ink on Parchment passes AAA with >= 14:1 contrast ratio', () => {
      const ratio = calculateContrastRatio(TOKENS.forestInk, TOKENS.parchment);
      expect(ratio).toBeGreaterThanOrEqual(14.0);
      expect(passesWcagAA(TOKENS.forestInk, TOKENS.parchment)).toBe(true);
    });

    it('should verify Canopy action green on Parchment exceeds the 4.5:1 AA body text threshold', () => {
      const ratio = calculateContrastRatio(TOKENS.canopy, TOKENS.parchment);
      expect(ratio).toBeGreaterThanOrEqual(6.0); // Specified around 6.44:1
      expect(passesWcagAA(TOKENS.canopy, TOKENS.parchment)).toBe(true);
    });

    it('should verify Deep Moss on Parchment exceeds 10:1 contrast ratio', () => {
      const ratio = calculateContrastRatio(TOKENS.deepMoss, TOKENS.parchment);
      expect(ratio).toBeGreaterThanOrEqual(10.0);
      expect(passesWcagAA(TOKENS.deepMoss, TOKENS.parchment)).toBe(true);
    });

    it('should verify Living Algae Accessible passes AA on both Parchment and Mineral Sand', () => {
      const ratioParchment = calculateContrastRatio(TOKENS.livingAlgaeAccessible, TOKENS.parchment);
      const ratioSand = calculateContrastRatio(TOKENS.livingAlgaeAccessible, TOKENS.mineralSand);

      expect(ratioParchment).toBeGreaterThanOrEqual(4.5);
      expect(ratioSand).toBeGreaterThanOrEqual(4.5);
    });

    it('should distinguish large text threshold (3.0:1) vs body text threshold (4.5:1)', () => {
      // Subdued color that passes large text (3.0) but fails body text (4.5)
      const subduedGreen = '#5A7D60';
      const ratio = calculateContrastRatio(subduedGreen, TOKENS.parchment);

      expect(ratio).toBeGreaterThanOrEqual(3.0);
      expect(ratio).toBeLessThan(4.5);
      expect(passesWcagAA(subduedGreen, TOKENS.parchment, true)).toBe(true);
      expect(passesWcagAA(subduedGreen, TOKENS.parchment, false)).toBe(false);
    });
  });

  describe('APCA Lightness Contrast (Lc) Calculations', () => {
    it('should calculate positive Lc for dark ink on light parchment', () => {
      const lc = calculateApcaLc(TOKENS.forestInk, TOKENS.parchment);
      expect(lc).toBeGreaterThan(60); // Strong positive contrast
    });

    it('should calculate negative Lc for light text on dark background', () => {
      const lc = calculateApcaLc(TOKENS.parchment, TOKENS.forestInk);
      expect(lc).toBeLessThan(-60); // Strong negative contrast
    });
  });
});
