import fs from 'node:fs';

import { fixTextEncoding } from './fix-text-encoding';

export const getTextFileContent = async (filePath: string): Promise<string> => {
  const fileBuffer = await fs.promises.readFile(filePath);

  return fixTextEncoding(fileBuffer);
};
