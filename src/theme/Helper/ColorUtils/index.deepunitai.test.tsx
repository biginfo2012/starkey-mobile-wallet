import { applyOpacityToHexColor } from './index';

describe('applyOpacityToHexColor', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should correctly apply opacity to a hex color', () => {
    const hexColor = '#abcdef';
    const opacity = 0.5;
    const result = applyOpacityToHexColor(hexColor, opacity);
    expect(result).toEqual('rgba(171, 205, 239, 0.5)');
  });
  it('should handle hex color without hash symbol', () => {
    const hexColor = 'abcdef';
    const opacity = 0.5;
    const result = applyOpacityToHexColor(hexColor, opacity);
    expect(result).toEqual('rgba(171, 205, 239, 0.5)');
  });
  it('should return default rgba when hex color is not provided', () => {
    const hexColor = '';
    const opacity = 0.5;
    const result = applyOpacityToHexColor(hexColor, opacity);
    expect(result).toEqual('rgba(0, 0, 0, 0.5)');
  });
  it('should handle when opacity is not provided', () => {
    const hexColor = '#abcdef';
    const opacity = 0;
    const result = applyOpacityToHexColor(hexColor, opacity);
    expect(result).toEqual('rgba(171, 205, 239, 0)');
  });
});
