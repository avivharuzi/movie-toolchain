import { downloadMovieSubtitle, fixSRTContent, fixTextEncoding } from './utils';

export const previewSubtitle = async ({
  ktuvitID,
  subtitleID,
}: PreviewSubtitleOptions): Promise<string> => {
  const subtitleBuffer = await downloadMovieSubtitle({
    id: ktuvitID,
    subID: subtitleID,
  });

  return fixSRTContent(fixTextEncoding(subtitleBuffer), {
    removeTextFormatting: true,
  });
};
