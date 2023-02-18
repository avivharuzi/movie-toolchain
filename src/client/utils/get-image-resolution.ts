export const getImageResolution = async (
  src: string
): Promise<ImageResolution> => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      });
    };

    image.onerror = (error) => {
      reject(error);
    };

    image.src = src;
  });
};
