export const fromFileToDataURL = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };

    fileReader.onerror = () => {
      reject(fileReader.error);
    };

    fileReader.readAsDataURL(file);
  });
};
