import * as ImagePicker from 'react-native-image-picker';

const ImagePickerService = () => {
  /**
   * Picks image file using the ImagePicker.
   * @returns {Promise<any>} A promise that resolves with the picked document.
   * @throws Will throw an error if the image picking fails.
   */
  const imagePicker = (): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      try {
        ImagePicker.launchImageLibrary(
          {
            mediaType: 'photo',
            includeBase64: false,
          },
          response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
              resolve(undefined); // Resolve with undefined if the user cancels
            } else if (response?.errorMessage) {
              console.error('ImagePicker Error:', response.errorMessage);
              reject(response.errorMessage); // Reject with the error if there's an issue
            } else if (response.assets && response.assets.length > 0) {
              resolve(response.assets[0].uri); // Resolve with the image URI
            } else {
              resolve(undefined); // Resolve with undefined if no image is picked
            }
          },
        );
      } catch (error) {
        console.error('Error during image picking:', error);
        reject(error); // Reject with the error if there's an issue
      }
    });
  };

  return {
    imagePicker,
  };
};

export default ImagePickerService;
