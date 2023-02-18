import Jimp from 'jimp';

import { getAspectRatio } from './get-aspect-ratio';

export interface ImageBlackBarsOptions {
  rgbThreshold: number;
}

export interface ImageBlackBars {
  originalWidth: number;
  originalHeight: number;
  originalAspectRatio: string;
  croppedWidth: number;
  croppedHeight: number;
  croppedAspectRatio: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const getDefaultBlackBarsOptions = (): ImageBlackBarsOptions => {
  return {
    rgbThreshold: 24,
  };
};

export const getImageBlackBars = async (
  image: string | Buffer,
  options: Partial<ImageBlackBarsOptions> = {}
): Promise<ImageBlackBars> => {
  const { rgbThreshold } = {
    ...getDefaultBlackBarsOptions(),
    ...options,
  };

  // Load image in Jimp
  const jimpImage = await Jimp.read(image as Buffer);

  // Get image resolution
  const { width, height } = jimpImage.bitmap;

  let topBar = 0;
  let bottomBar = 0;
  let leftBar = 0;
  let rightBar = 0;

  // Check black bars on top and bottom of image
  for (let y = 0; y < height; y++) {
    let isBlack = true;
    for (let x = 0; x < width; x++) {
      const color = Jimp.intToRGBA(jimpImage.getPixelColor(x, y));
      if (
        color.r > rgbThreshold ||
        color.g > rgbThreshold ||
        color.b > rgbThreshold
      ) {
        isBlack = false;
        break;
      }
    }
    if (isBlack) {
      topBar++;
    } else {
      break;
    }
  }
  for (let y = height - 1; y >= 0; y--) {
    let isBlack = true;
    for (let x = 0; x < width; x++) {
      const color = Jimp.intToRGBA(jimpImage.getPixelColor(x, y));
      if (
        color.r > rgbThreshold ||
        color.g > rgbThreshold ||
        color.b > rgbThreshold
      ) {
        isBlack = false;
        break;
      }
    }
    if (isBlack) {
      bottomBar++;
    } else {
      break;
    }
  }

  // Check black bars on left and right of image
  for (let x = 0; x < width; x++) {
    let isBlack = true;
    for (let y = 0; y < height; y++) {
      const color = Jimp.intToRGBA(jimpImage.getPixelColor(x, y));
      if (
        color.r > rgbThreshold ||
        color.g > rgbThreshold ||
        color.b > rgbThreshold
      ) {
        isBlack = false;
        break;
      }
    }
    if (isBlack) {
      leftBar++;
    } else {
      break;
    }
  }
  for (let x = width - 1; x >= 0; x--) {
    let isBlack = true;
    for (let y = 0; y < height; y++) {
      const color = Jimp.intToRGBA(jimpImage.getPixelColor(x, y));
      if (
        color.r > rgbThreshold ||
        color.g > rgbThreshold ||
        color.b > rgbThreshold
      ) {
        isBlack = false;
        break;
      }
    }
    if (isBlack) {
      rightBar++;
    } else {
      break;
    }
  }

  const originalAspectRatio = getAspectRatio(width, height, true);
  const croppedWidth = width - leftBar - rightBar;
  const croppedHeight = height - topBar - bottomBar;
  const croppedAspectRatio = getAspectRatio(croppedWidth, croppedHeight, true);

  return {
    originalWidth: width,
    originalHeight: height,
    originalAspectRatio,
    croppedWidth,
    croppedHeight,
    croppedAspectRatio,
    top: topBar,
    right: rightBar,
    bottom: bottomBar,
    left: leftBar,
  };
};
