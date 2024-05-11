import RNQRGenerator from 'rn-qr-generator';

const QRGeneratorService = () => {
  /**
   * Detects QR code in an image using the specified path.
   * @param {string} path - The path to the image.
   * @returns {Promise<string | undefined>} - A Promise that resolves with the detected QR code string or undefined if no QR code is found.
   */
  const getQRCodeFromImage = async (
    path: string,
  ): Promise<string | undefined> => {
    try {
      // Perform QR code detection using the RNQRGenerator library
      const response = await RNQRGenerator.detect({ uri: path });

      // Check if QR code values are present in the response
      if (response.values && response.values.length > 0) {
        // Return the first detected QR code value
        return response.values[0];
      } else {
        // Log a message when no QR code is found in the image
        console.log('No QR code found in the image');
        // Return undefined when no QR code is found
        return undefined;
      }
    } catch (error) {
      // Log an error message when an error occurs during QR code detection
      console.error('Error detecting QR code in image', error);
      // Throw the error to be caught by the caller
      throw error;
    }
  };

  return {
    getQRCodeFromImage,
  };
};

export default QRGeneratorService;
