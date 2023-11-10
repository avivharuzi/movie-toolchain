import { ipcMain } from 'electron';

import { cropImageBase64 } from './crop-image-base-64';
import { downloadSubtitle } from './download-subtitle';
import { getImageBlackBars } from './get-image-black-bars';
import { getMovieDetails } from './get-movie-details';
import { previewSubtitle } from './preview-subtitle';
import { saveMoviePrepareFiles } from './save-movie-prepare-files';
import { selectDirectory } from './select-directory';

export const createIpcMainEvents = (): void => {
  ipcMain.handle('getMovieDetails', (_event, imdbID: string) =>
    getMovieDetails(imdbID)
  );

  ipcMain.handle('previewSubtitle', (_event, options: PreviewSubtitleOptions) =>
    previewSubtitle(options)
  );

  ipcMain.handle(
    'downloadSubtitle',
    (_event, options: DownloadSubtitleOptions) => downloadSubtitle(options)
  );

  ipcMain.handle('selectDirectory', () => selectDirectory());

  ipcMain.handle(
    'saveMoviePrepareFiles',
    (_event, options: SaveMoviePrepareFilesOptions) =>
      saveMoviePrepareFiles(options)
  );

  ipcMain.handle(
    'getImageBlackBars',
    (_event, image: string, options?: Partial<ImageBlackBarsOptions>) =>
      getImageBlackBars(image, options)
  );

  ipcMain.handle('cropImageBase64', (_event, options: CropImageBase64Options) =>
    cropImageBase64(options)
  );
};
