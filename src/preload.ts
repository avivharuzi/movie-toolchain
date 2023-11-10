import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getMovieDetails: (imdbID: string) =>
    ipcRenderer.invoke('getMovieDetails', imdbID),
  previewSubtitle: (options: PreviewSubtitleOptions) =>
    ipcRenderer.invoke('previewSubtitle', options),
  downloadSubtitle: (options: DownloadSubtitleOptions) =>
    ipcRenderer.invoke('downloadSubtitle', options),
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  saveMoviePrepareFiles: (options: SaveMoviePrepareFilesOptions) =>
    ipcRenderer.invoke('saveMoviePrepareFiles', options),
  getImageBlackBars: (
    image: string,
    options?: Partial<ImageBlackBarsOptions>
  ) => ipcRenderer.invoke('getImageBlackBars', image, options),
  cropImageBase64: (options: CropImageBase64Options) =>
    ipcRenderer.invoke('cropImageBase64', options),
});
