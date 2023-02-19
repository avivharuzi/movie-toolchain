export {};

interface ElectronAPI {
  getMovieDetails: (imdbID: string) => Promise<MovieDetails | null>;
  downloadSubtitle: (options: DownloadSubtitleOptions) => Promise<void>;
  selectDirectory: () => Promise<string | null>;
  saveMoviePrepareFiles: (
    options: SaveMoviePrepareFilesOptions
  ) => Promise<void>;
  getImageBlackBars: (
    image: string,
    options?: Partial<ImageBlackBarsOptions>
  ) => Promise<ImageBlackBars>;
  cropImageBase64: (options: CropImageBase64Options) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }

  interface MovieDetails {
    id: string;
    ktuvitID: string;
    title: string;
    originalTitle: string;
    releaseDate: string;
    poster: MovieImageSrc;
    backdrop: MovieImageSrc;
    posters: MovieImage[];
    backdrops: MovieImage[];
    subtitles: MovieSubtitle[];
  }

  interface MovieImage {
    id: string;
    width: number;
    height: number;
    src: MovieImageSrc;
  }

  interface MovieImageSrc {
    w500: string;
    original: string;
  }

  interface MovieSubtitle {
    id: string;
    fileName: string;
    downloads: number;
    uploadDate: Date;
    fileSize: string;
    fileType: string;
    credit: string;
  }

  interface DownloadSubtitleOptions {
    ktuvitID: string;
    subtitleID: string;
    fileName: string;
    outputPath: string;
  }

  interface SaveMoviePrepareFilesOptions {
    posterImage: string;
    backdropImage: string;
    ktuvitID: string;
    subtitleID: string;
    outputPath: string;
  }

  interface ImageResolution {
    width: number;
    height: number;
  }

  interface ImageBlackBars {
    originalWidth: number;
    originalHeight: number;
    originalAspectRatio: string;
    croppedWidth: number;
    croppedHeight: number;
    croppedAspectRatio: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface ImageBlackBarsOptions {
    rgbThreshold: number;
  }

  interface CropImageBase64Options {
    image: string | Buffer;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
}
