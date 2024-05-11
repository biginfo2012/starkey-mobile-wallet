/* eslint-disable no-bitwise */
// This function applies opacity to a hexadecimal color code and returns the corresponding RGBA color.
// It takes a hexColor string and an opacity number as input.
export const applyOpacityToHexColor = (
  hexColor: string,
  opacity: number,
): string => {
  const hexWithoutHash = hexColor?.replace('#', ''); // Remove the '#' symbol from the hexColor string

  // Function to convert a hexadecimal color code to its RGB components
  const hexToRGB = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255; // Extract the red component
    const g = (bigint >> 8) & 255; // Extract the green component
    const b = bigint & 255; // Extract the blue component
    return [r, g, b];
  };

  const [r, g, b] = hexToRGB(hexWithoutHash); // Get the RGB components from the hex color
  const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`; // Create the RGBA color string with the specified opacity

  return rgbaColor; // Return the RGBA color string
};
