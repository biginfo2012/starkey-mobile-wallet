import Share from 'react-native-share';

const ShareManagerService = () => {
  const shareText = async (text: string, options?: object): Promise<void> => {
    try {
      await Share.open({ message: text, ...options });
    } catch (error: any) {
      throw new Error(`Error sharing text: ${error.message}`);
    }
  };

  const shareImage = async (imagePath: string): Promise<void> => {
    try {
      const shareOptions = {
        url: imagePath,
      };
      await Share.open(shareOptions);
    } catch (error: any) {
      throw new Error(`Error sharing image: ${error.message}`);
    }
  };

  const shareJsonFile = async (filePath: string): Promise<void> => {
    try {
      await Share.open({
        url: `file://${filePath}`, // Share the file using its path
        type: 'application/json',
      });
    } catch (error: any) {
      throw new Error(`Error sharing JSON File: ${error.message}`);
    }
  };

  const shareURL = async (url: string): Promise<void> => {
    try {
      const shareOptions = {
        url: url,
      };
      await Share.open(shareOptions);
    } catch (error: any) {
      throw new Error(`Error sharing URL: ${error.message}`);
    }
  };

  const shareFile = async (
    filePath: string,
    options?: object,
  ): Promise<void> => {
    try {
      await Share.open({ url: `file://${filePath}`, ...options });
    } catch (error: any) {
      throw new Error(`Error sharing file: ${error.message}`);
    }
  };

  return {
    shareText,
    shareImage,
    shareFile,
    shareURL,
    shareJsonFile,
  };
};

export default ShareManagerService;
