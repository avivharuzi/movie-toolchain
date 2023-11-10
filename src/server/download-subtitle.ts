import fs from 'node:fs';
import path from 'node:path';

import { downloadMovieSubtitle, fixSRTContent, fixTextEncoding } from './utils';

export const downloadSubtitle = async ({
  ktuvitID,
  subtitleID,
  fileName,
  outputPath,
}: DownloadSubtitleOptions): Promise<void> => {
  const subtitleBuffer = await downloadMovieSubtitle({
    id: ktuvitID,
    subID: subtitleID,
  });

  const subFilePath = path.join(outputPath, `${fileName}.srt`);

  const fileContent = fixSRTContent(fixTextEncoding(subtitleBuffer), {
    removeTextFormatting: true,
  });

  await fs.promises.writeFile(subFilePath, fileContent);
};
