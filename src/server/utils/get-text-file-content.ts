import fs from 'node:fs';

import chardet from 'chardet';
import iconv from 'iconv-lite';

const DEFAULT_ENCODING = 'utf-8';

export const getTextFileContent = async (filePath: string): Promise<string> => {
  const fileContent = await fs.promises.readFile(filePath);

  const encoding = chardet.detect(fileContent);

  return iconv.decode(fileContent, encoding || DEFAULT_ENCODING);
};
