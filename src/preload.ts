import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getMovieDetails: (imdbID: string) =>
    ipcRenderer.invoke('getMovieDetails', imdbID),
  downloadSubtitle: (options: DownloadSubtitleOptions) =>
    ipcRenderer.invoke('downloadSubtitle', options),
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  saveMoviePrepareFiles: (options: SaveMoviePrepareFilesOptions) =>
    ipcRenderer.invoke('saveMoviePrepareFiles', options),
  cropImageBase64: (options: CropImageBase64Options) =>
    ipcRenderer.invoke('cropImageBase64', options),
});
