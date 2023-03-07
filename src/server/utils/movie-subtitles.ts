import axios from 'axios';
import jsdom from 'jsdom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import imdb2name from 'name-to-imdb';

import { KTUVIT_LOGIN_COOKIE } from './config';

interface KtuvitResponse {
  d: string;
}

interface KtuvitSearch {
  Films: KtuvitSearchFilm[];
  IsSuccess: boolean;
  ErrorMessage: string;
}

interface KtuvitSearchFilm {
  ID: string;
  EngName: string;
  IMDB_Link: string;
  ImdbID: string;
}

interface KtuvitDownloadIdentifier {
  ValidIn: number;
  DownloadIdentifier: string;
  IsSuccess: boolean;
  ErrorMessage: string;
}

export interface MovieSubtitlesResponse {
  ktuvitID: string;
  subtitles: MovieSubtitle[];
}

export interface DownloadMovieSubtitleOptions {
  id: string;
  subID: string;
}

const IMDB_NAMES_RECORD: Record<string, string> = {};
const KTUVIT_BASE_URL = 'https://www.ktuvit.me';
const KTUVIT_HTTP_HEADERS = {
  accept: 'application/json, text/javascript, */*; q=0.01',
  cookie: `Login=${KTUVIT_LOGIN_COOKIE}`,
};

const ktuvitHTTPPost = async <T, U>(path: string, body: U): Promise<T> => {
  const { data } = await axios.post<T>(`${KTUVIT_BASE_URL}/${path}`, body, {
    withCredentials: true,
    headers: KTUVIT_HTTP_HEADERS,
  });

  return data;
};

const ktuvitHTTPGet = async <T>(path: string): Promise<T> => {
  const { data } = await axios.get<T>(`${KTUVIT_BASE_URL}/${path}`, {
    withCredentials: true,
    headers: KTUVIT_HTTP_HEADERS,
  });

  return data;
};

const ktuvitSearch = async (movieTitle: string) => {
  const query = {
    FilmName: movieTitle,
    Actors: [] as string[],
    Studios: null as null,
    Directors: [] as string[],
    Genres: [] as string[],
    Countries: [] as string[],
    Languages: [] as string[],
    Year: '',
    Rating: [] as string[],
    Page: 1,
    SearchType: '0', // '-1' for all, '0' for movie, '1' for tv show
    WithSubsOnly: false,
  };

  const data = await ktuvitHTTPPost<KtuvitResponse, object>(
    'Services/ContentProvider.svc/SearchPage_search',
    {
      request: query,
    }
  );

  const parsedData = JSON.parse(data.d) as KtuvitSearch;

  if (parsedData.ErrorMessage !== null) {
    throw new Error('Incorrect search Values');
  }

  return parsedData.Films;
};

const getIMDBMovieTitleName = (imdbID: string): Promise<string | null> => {
  return new Promise((resolve) => {
    imdb2name(
      imdbID,
      (err: Error, res: string, inf: { meta: { name?: string } }) => {
        if (err) {
          return resolve(null);
        }

        resolve(inf.meta?.name || null);
      }
    );
  });
};

const getKtuvitID = async (
  imdbID: string,
  title: string
): Promise<string | null> => {
  let movieTitle: string | null;

  if (imdbID in IMDB_NAMES_RECORD) {
    movieTitle = IMDB_NAMES_RECORD[imdbID];
  } else {
    movieTitle = await getIMDBMovieTitleName(imdbID);

    if (movieTitle) {
      IMDB_NAMES_RECORD[imdbID] = movieTitle;
    } else {
      movieTitle = title;
    }
  }

  let searchResults: KtuvitSearchFilm[] = [];

  try {
    searchResults = await ktuvitSearch(movieTitle);
  } catch (error) {
    // Do nothing if there is an error.
  }

  // Check if we can search for alternative title if there are no results.
  if (searchResults.length === 0 && movieTitle !== title) {
    try {
      searchResults = await ktuvitSearch(title);
    } catch (error) {
      // Again we will not do anything here.
    }
  }

  let searchResult = searchResults.find(
    (searchResult) => searchResult.ImdbID === imdbID
  );

  if (!searchResult) {
    // Try to find imdb link.
    searchResult = searchResults.find(
      (searchResult) =>
        searchResult.IMDB_Link.split('/')
          .filter((text) => text.trim() !== '')
          .at(-1) === imdbID
    );
  }

  if (!searchResult) {
    // Try to find by title.
    searchResult = searchResults.find(
      (searchResult) =>
        searchResult.EngName.toLowerCase() === movieTitle.toLowerCase()
    );
  }

  return (
    searchResult?.ID ||
    (searchResults.length > 0 && searchResults[0].ID) ||
    null
  );
};

const getKtuvitMovie = async (ktuvitID: string): Promise<string> => {
  return ktuvitHTTPGet(`MovieInfo.aspx?ID=${ktuvitID}`);
};

const extractKtuvitSubtitlesFromHTML = (html: string): MovieSubtitle[] => {
  html = html.includes('<!DOCTYPE html>')
    ? html
    : `<!DOCTYPE html><table id="subtitlesList"><thead><tr/></thead>${html}</table>`;

  const dummyDom = new jsdom.JSDOM(html).window;

  const subtitlesListElement = dummyDom.document.getElementById(
    'subtitlesList'
  ) as HTMLTableElement;

  return [...subtitlesListElement.rows]
    .filter((_, index) => index !== 0)
    .map((row) => {
      const id = row.cells[5].firstElementChild
        .getAttribute('data-subtitle-id')
        .trim();

      const fileName = row.cells[0]
        .querySelector('div')
        .textContent.trim()
        .split('\n')[0];

      const downloads = parseInt(row.cells[4].textContent);

      const uploadDate = new Date(
        row.cells[3].textContent.split('/').reverse().join('-')
      );

      const fileSize = row.cells[2].textContent;
      const fileType = row.cells[1].textContent;
      const credit = [...row.cells[0].querySelectorAll('div > small')]
        .map((el) => el.textContent)
        .join('');

      return {
        id,
        fileName,
        downloads,
        uploadDate,
        fileSize,
        fileType,
        credit,
      };
    });
};

export const getMovieSubtitles = async (
  imdbID: string,
  title: string
): Promise<MovieSubtitlesResponse> => {
  const emptyMovieSubtitles: MovieSubtitlesResponse = {
    ktuvitID: '',
    subtitles: [],
  };

  try {
    const ktuvitID = await getKtuvitID(imdbID, title);

    if (!ktuvitID) {
      return emptyMovieSubtitles;
    }

    const movieHTML = await getKtuvitMovie(ktuvitID);

    const subtitles = extractKtuvitSubtitlesFromHTML(movieHTML);

    return {
      ktuvitID,
      subtitles,
    };
  } catch (err) {
    return emptyMovieSubtitles;
  }
};

export const downloadMovieSubtitle = async ({
  id,
  subID,
}: DownloadMovieSubtitleOptions): Promise<Buffer> => {
  const downloadIdentifierRequest = {
    FilmID: id,
    SubtitleID: subID,
    FontSize: 0,
    FontColor: '',
    PredefinedLayout: -1,
  };

  // To prevent unknown download calls. each download has a one time use token called download identifier.
  const data = await ktuvitHTTPPost<KtuvitResponse, object>(
    'Services/ContentProvider.svc/RequestSubtitleDownload',
    { request: downloadIdentifierRequest }
  );

  const { DownloadIdentifier: downloadIdentifier } = JSON.parse(
    data.d
  ) as KtuvitDownloadIdentifier;

  if (!downloadIdentifier) {
    throw new Error('There was a problem to get downloadIdentifier');
  }

  const { data: buffer } = await axios.get<Buffer>(
    `${KTUVIT_BASE_URL}/Services/DownloadFile.ashx?DownloadIdentifier=${downloadIdentifier}`,
    {
      withCredentials: true,
      headers: KTUVIT_HTTP_HEADERS,
      responseType: 'arraybuffer',
    }
  );

  return buffer;
};
