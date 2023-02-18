export {};

interface ElectronAPI {
  getMovieDetails: (imdbID: string) => Promise<MovieDetails | null>;
  downloadSubtitle: (options: DownloadSubtitleOptions) => Promise<void>;
  selectDirectory: () => Promise<string | null>;
  saveMoviePrepareFiles: (
    options: SaveMoviePrepareFilesOptions
  ) => Promise<void>;
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

  interface CropImageBase64Options {
    image: string | Buffer;
    top: number;
    right: number;
    bottom: number;
    left: number;
  }
}
