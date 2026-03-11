import {
  DEVICE_CHIP_CONFIG,
  getSourceChipConfig,
  STATUS_CHIP_CONFIG,
} from '@/features/orders/utils/statusHelpers';

// ---------------------------------------------------------------------------
// STATUS_CHIP_CONFIG
// ---------------------------------------------------------------------------

describe('STATUS_CHIP_CONFIG', () => {
  it('has entries for all four statuses', () => {
    expect(STATUS_CHIP_CONFIG.excellent).toBeDefined();
    expect(STATUS_CHIP_CONFIG.good).toBeDefined();
    expect(STATUS_CHIP_CONFIG.warning).toBeDefined();
    expect(STATUS_CHIP_CONFIG.loss).toBeDefined();
  });

  it('excellent config has correct label and icon', () => {
    expect(STATUS_CHIP_CONFIG.excellent.label).toBe('Excellent');
    expect(STATUS_CHIP_CONFIG.excellent.icon).toBe('↑');
    expect(STATUS_CHIP_CONFIG.excellent.variant).toBe('excellent');
  });

  it('loss config has correct label and icon', () => {
    expect(STATUS_CHIP_CONFIG.loss.label).toBe('Loss');
    expect(STATUS_CHIP_CONFIG.loss.icon).toBe('↓');
    expect(STATUS_CHIP_CONFIG.loss.variant).toBe('loss');
  });

  it('every config has required fields', () => {
    Object.values(STATUS_CHIP_CONFIG).forEach((config) => {
      expect(config.variant).toBeTruthy();
      expect(config.label).toBeTruthy();
      expect(config.ariaLabel).toBeTruthy();
    });
  });
});

// ---------------------------------------------------------------------------
// DEVICE_CHIP_CONFIG
// ---------------------------------------------------------------------------

describe('DEVICE_CHIP_CONFIG', () => {
  it('has configs for mobile and desktop', () => {
    expect(DEVICE_CHIP_CONFIG.mobile).toBeDefined();
    expect(DEVICE_CHIP_CONFIG.desktop).toBeDefined();
  });

  it('mobile config has correct label', () => {
    expect(DEVICE_CHIP_CONFIG.mobile.label).toBe('Mobile');
  });

  it('desktop config has correct label', () => {
    expect(DEVICE_CHIP_CONFIG.desktop.label).toBe('Desktop');
  });
});

// ---------------------------------------------------------------------------
// getSourceChipConfig
// ---------------------------------------------------------------------------

describe('getSourceChipConfig', () => {
  it('returns Google config for "gsearch"', () => {
    expect(getSourceChipConfig('gsearch').label).toBe('Google');
  });

  it('returns Bing config for "bsearch"', () => {
    expect(getSourceChipConfig('bsearch').label).toBe('Bing');
  });

  it('returns Social config for "socialbook"', () => {
    expect(getSourceChipConfig('socialbook').label).toBe('Social');
  });

  it('is case-insensitive', () => {
    expect(getSourceChipConfig('GSEARCH').label).toBe('Google');
    expect(getSourceChipConfig('Bsearch').label).toBe('Bing');
  });

  it('returns fallback with raw source as label for unknown values', () => {
    const config = getSourceChipConfig('unknown_channel');
    expect(config.label).toBe('unknown_channel');
    expect(config.variant).toBe('direct');
  });
});
