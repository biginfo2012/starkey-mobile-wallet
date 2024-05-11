import DocumentPicker, {
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

const DocumentService = () => {
  /**
   * Picks a single document file using the DocumentPicker.
   * @returns {Promise<any>} A promise that resolves with the picked document.
   * @throws Will throw an error if the document picking fails.
   */
  const documentPickerFile = async (): Promise<any> => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
        type: types.json,
      });
      return pickerResult;
    } catch (error) {
      handleDocumentPickerError(error);
    }
  };

  /**
   * Handles errors that may occur during document picking.
   * @param {unknown} error - The error thrown during document picking.
   */
  const handleDocumentPickerError = (error: unknown) => {
    if (isCancel(error)) {
      console.warn('Document picking cancelled');
      // User cancelled the picker, exit any dialogs or menus and move on
    } else if (isInProgress(error)) {
      console.warn(
        'Multiple pickers were opened; only the last will be considered',
      );
    } else {
      console.error('Error during document picking:', error);
      // Handle other types of errors (e.g., unexpected errors)
      throw error;
    }
  };

  return {
    documentPickerFile,
  };
};

export default DocumentService;
