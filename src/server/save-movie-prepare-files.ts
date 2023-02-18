import fs from 'node:fs';
import path from 'node:path';

import {
  downloadMovieSubtitle,
  fixSRTFile,
  getImageBufferFromURL,
  resizeImage,
} from './utils';

const saveMovieImages = async ({
  posterImage,
  backdropImage,
  outputPath,
}: SaveMoviePrepareFilesOptions) => {
  const [posterImageBuffer, backdropImageBuffer] = await Promise.all([
    getImageBufferFromURL(posterImage),
    getImageBufferFromURL(backdropImage),
  ]);

  const posterImageFilePath = path.join(outputPath, 'cover.jpg');
  const backdropImageFilePath = path.join(outputPath, 'cover_land.jpg');

  await Promise.all([
    resizeImage(posterImageBuffer, {
      width: 600,
      targetFilePath: posterImageFilePath,
      mimeType: 'image/jpeg',
    }),
    resizeImage(backdropImageBuffer, {
      height: 600,
      targetFilePath: backdropImageFilePath,
      mimeType: 'image/jpeg',
    }),
  ]);
};

const saveMovieSubtitle = async ({
  ktuvitID,
  subtitleID,
  outputPath,
}: SaveMoviePrepareFilesOptions): Promise<void> => {
  const subtitleBuffer = await downloadMovieSubtitle({
    id: ktuvitID,
    subID: subtitleID,
  });

  const tempFilePath = path.join(outputPath, 'temp.srt');
  const subFilePath = path.join(outputPath, 'sub.srt');

  await fs.promises.writeFile(tempFilePath, subtitleBuffer);

  await fixSRTFile(tempFilePath, subFilePath, {
    removeTextFormatting: true,
  });

  await fs.promises.rm(tempFilePath);
};

export const saveMoviePrepareFiles = async (
  options: SaveMoviePrepareFilesOptions
): Promise<void> => {
  await Promise.all([saveMovieImages(options), saveMovieSubtitle(options)]);
};
