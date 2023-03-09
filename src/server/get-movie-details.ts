import axios from 'axios';

import { generateUUID, getMovieSubtitles, TMDB_API_KEY } from './utils';

interface TMBDFind {
  movie_results: TMDBFindMovieResult[];
}

interface TMDBFindMovieResult {
  id: string;
}

interface TMDBMovie {
  id: string;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  images: {
    posters: TMDBMovieImage[];
    backdrops: TMDBMovieImage[];
  };
}

interface TMDBMovieImage {
  iso_639_1: string | null;
  width: number;
  height: number;
  file_path: string;
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TMDB_IMAGE_ORIGINAL = 'original';
const TMDB_IMAGE_W500 = 'w500';

const tmdbRequest = async <T, U>(path: string, queryParams: U): Promise<T> => {
  const params = {
    api_key: TMDB_API_KEY,
    ...queryParams,
  };

  const { data } = await axios.get<T>(`${TMDB_BASE_URL}/${path}`, {
    params,
  });

  if (!data) {
    throw new Error('data is empty');
  }

  return data;
};

const tmdbFind = async (imdbID: string): Promise<TMBDFind> => {
  return tmdbRequest(`find/${imdbID}`, {
    external_source: 'imdb_id',
  });
};

const tmdbMovie = async (id: string): Promise<TMDBMovie> => {
  return tmdbRequest(`movie/${id}`, {
    append_to_response: 'images',
  });
};

const fromSrcToMovieImageSrc = (src: string): MovieImageSrc => {
  return {
    original: `${TMDB_IMAGE_BASE_URL}/${TMDB_IMAGE_ORIGINAL}${src}`,
    w500: `${TMDB_IMAGE_BASE_URL}/${TMDB_IMAGE_W500}${src}`,
  };
};

const fromTMDBImageToMovieImage = ({
  width,
  height,
  file_path,
}: TMDBMovieImage): MovieImage => {
  return {
    id: generateUUID(),
    width,
    height,
    src: fromSrcToMovieImageSrc(file_path),
  };
};

const convertToMovieImages = (images: TMDBMovieImage[]): MovieImage[] => {
  return images
    .filter(
      (image) =>
        image.iso_639_1 === null || image.iso_639_1?.toLowerCase() === 'en'
    )
    .map((image) => fromTMDBImageToMovieImage(image));
};

export const getMovieDetails = async (
  imdbID: string
): Promise<MovieDetails | null> => {
  const { movie_results } = await tmdbFind(imdbID);

  if (!movie_results || movie_results.length === 0) {
    return null;
  }

  const id = movie_results[0].id;

  const {
    title,
    original_title,
    release_date,
    poster_path,
    backdrop_path,
    images,
  } = await tmdbMovie(id);

  const { ktuvitID, subtitles } = await getMovieSubtitles(imdbID, title);

  return {
    id,
    ktuvitID,
    title,
    originalTitle: original_title,
    releaseDate: release_date,
    poster: fromSrcToMovieImageSrc(poster_path),
    backdrop: fromSrcToMovieImageSrc(backdrop_path),
    posters: convertToMovieImages(images.posters),
    backdrops: convertToMovieImages(images.backdrops),
    subtitles,
  };
};
