import fs from 'node:fs';
import path from 'node:path';

import { downloadMovieSubtitle } from './utils';

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

  await fs.promises.writeFile(subFilePath, subtitleBuffer);
};
