import chardet from 'chardet';
import iconv from 'iconv-lite';

const DEFAULT_ENCODING = 'utf-8';

export const fixTextEncoding = (buffer: Buffer): string => {
  const encoding = chardet.detect(buffer);

  return iconv.decode(buffer, encoding || DEFAULT_ENCODING);
};
