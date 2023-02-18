import { fileTypeFromBuffer } from 'file-type';

import { cropImage } from './utils';

export const cropImageBase64 = async (
  options: CropImageBase64Options
): Promise<string> => {
  const buffer = await cropImage(options.image, options);

  const { mime } = await fileTypeFromBuffer(buffer);

  const base64 = Buffer.from(buffer).toString('base64');

  return `data:${mime};base64,${base64}`;
};
