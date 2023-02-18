import fs from 'node:fs';

import Jimp from 'jimp';

export type ResizeImageMIMEType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/bmp'
  | 'image/x-ms-bmp'
  | 'image/tiff';

interface ResizeImageOptions {
  width?: number;
  height?: number;
  mimeType?: ResizeImageMIMEType;
  targetFilePath?: string;
}

export const resizeImage = async (
  input: string | Buffer,
  options: ResizeImageOptions
): Promise<Buffer> => {
  const jimpImage = await Jimp.read(input as Buffer);

  const {
    width = Jimp.AUTO,
    height = Jimp.AUTO,
    mimeType,
    targetFilePath,
  } = options;

  const imageMimeType = mimeType || jimpImage.getMIME();

  // Resize the image.
  jimpImage.resize(width, height);

  // Get the resized image buffer.
  const resizedImageBuffer = await jimpImage.getBufferAsync(imageMimeType);

  if (targetFilePath) {
    // If targetFilePath was provided save the image.
    await fs.promises.writeFile(targetFilePath, resizedImageBuffer);
  }

  return resizedImageBuffer;
};
