import fs from 'node:fs';

import Jimp from 'jimp';

export interface CropImageOptions {
  top: number;
  right: number;
  bottom: number;
  left: number;
  targetFilePath?: string;
}

export const cropImage = async (
  image: string | Buffer,
  options: CropImageOptions
): Promise<Buffer> => {
  const jimpImage = await Jimp.read(image as Buffer);

  // 1920, 1080
  const { width, height } = jimpImage.bitmap;

  // Calc new position for Jimp
  const left = options.left;
  const right = width - options.right;
  const top = options.top;
  const bottom = height - options.bottom;

  // 100
  const x = left;
  // 20
  const y = top;

  // 1910 - 100 = 1810
  const cropWidth = right - left;
  // 1060 - 20 = 1040
  const cropHeight = bottom - top;

  const croppedImage = jimpImage.crop(x, y, cropWidth, cropHeight);

  const croppedImageBuffer = await croppedImage.getBufferAsync(
    croppedImage.getMIME()
  );

  const { targetFilePath } = options;

  if (targetFilePath) {
    await fs.promises.writeFile(targetFilePath, croppedImageBuffer);
  }

  return croppedImageBuffer;
};
