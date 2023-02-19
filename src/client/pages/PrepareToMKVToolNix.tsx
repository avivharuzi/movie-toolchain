import { format } from 'date-fns';
import { useState } from 'react';

import IconWithText from '../components/IconWithText';
import Loader from '../components/Loader';
import MovieDetailsStat from '../components/MovieDetailsStat';
import SelectImage from '../components/SelectImage';
import SelectSubtitle from '../components/SelectSubtitle';

interface PrepareToMKVToolNixForm {
  selectedPoster: MovieImage | null;
  selectedBackdrop: MovieImage | null;
  selectedSubtitle: MovieSubtitle | null;
}

const getDefaultFormValue = (): PrepareToMKVToolNixForm => {
  return {
    selectedPoster: null,
    selectedBackdrop: null,
    selectedSubtitle: null,
  };
};

const PrepareToMKVToolNix = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [formValue, setFormValue] = useState<PrepareToMKVToolNixForm>(
    getDefaultFormValue()
  );

  const handleSearch = async (): Promise<void> => {
    if (!searchValue) {
      return;
    }

    setIsLoading(true);

    setFormValue(getDefaultFormValue());

    const movieDetails = await window.electronAPI.getMovieDetails(searchValue);

    setMovie(movieDetails);

    setIsLoading(false);
  };

  const handleFormValueChange = (
    partialFormValue: Partial<PrepareToMKVToolNixForm>
  ) => {
    setFormValue({
      ...formValue,
      ...partialFormValue,
    });
  };

  const handleDownloadSubtitle = async (
    subtitle: MovieSubtitle
  ): Promise<void> => {
    const directory = await window.electronAPI.selectDirectory();

    if (!directory) {
      return;
    }

    setIsLoading(true);

    await window.electronAPI.downloadSubtitle({
      ktuvitID: movie.ktuvitID,
      subtitleID: subtitle.id,
      outputPath: directory,
      fileName: subtitle.fileName,
    });

    setIsLoading(false);
  };

  const handleBrowse = async (): Promise<void> => {
    if (!isValidToSave) {
      return;
    }

    const directory = await window.electronAPI.selectDirectory();

    if (!directory) {
      return;
    }

    setIsLoading(true);

    const { selectedPoster, selectedBackdrop, selectedSubtitle } = formValue;

    await window.electronAPI.saveMoviePrepareFiles({
      ktuvitID: movie.ktuvitID,
      subtitleID: selectedSubtitle.id,
      posterImage: selectedPoster.src.original,
      backdropImage: selectedBackdrop.src.original,
      outputPath: directory,
    });

    setIsLoading(false);
  };

  const movieTitle = movie
    ? `${movie.title} (${format(new Date(movie.releaseDate), 'yyyy')})`
    : '';

  const movieFileName = movie
    ? `${movie.title.replace(/\s/g, '.').replace(/:/g, '')}.${format(
        new Date(movie.releaseDate),
        'yyyy'
      )}.1080p.BluRay.x264`
    : '';

  const movieAudioAC3 = 'English (AC3) (5.1 ch)';
  const movieAudioAAC = 'English (AAC) (2.0 ch)';
  const movieSubtitle = 'Hebrew (SRT)';

  const isValidToSave =
    formValue.selectedPoster &&
    formValue.selectedBackdrop &&
    formValue.selectedSubtitle;

  return (
    <div className="d-flex flex-column gap-4">
      <Loader isLoading={isLoading} />

      <div className="d-flex gap-2">
        <input
          onInput={(event) =>
            setSearchValue((event.target as HTMLInputElement).value)
          }
          className="form-control"
          placeholder="IMDB ID..."
        />
        <button onClick={handleSearch} className="btn btn-primary">
          <IconWithText name="search">Search</IconWithText>
        </button>
      </div>

      {movie ? (
        <div className="d-flex flex-column gap-4">
          <div>
            <p className="text-muted">Movie details:</p>
            <MovieDetailsStat text={movieTitle} />
            <MovieDetailsStat text={movieAudioAC3} />
            <MovieDetailsStat text={movieAudioAAC} />
            <MovieDetailsStat text={movieSubtitle} />
            <MovieDetailsStat text={movieFileName} />
          </div>
          <div>
            <p className="text-muted">Select poster image:</p>
            <p></p>
            <SelectImage
              images={movie.posters}
              selectedImage={formValue.selectedPoster}
              onSelectImage={(image) =>
                handleFormValueChange({ selectedPoster: image })
              }
            />
          </div>
          <div>
            <p className="text-muted">Select backdrop image:</p>
            <SelectImage
              images={movie.backdrops}
              selectedImage={formValue.selectedBackdrop}
              onSelectImage={(image) =>
                handleFormValueChange({ selectedBackdrop: image })
              }
            />
          </div>
          <div>
            <p className="text-muted">Select subtitle:</p>
            <SelectSubtitle
              subtitles={movie.subtitles}
              selectedSubtitle={formValue.selectedSubtitle}
              onSelectSubtitle={(subtitle) =>
                handleFormValueChange({ selectedSubtitle: subtitle })
              }
              onDownloadSubtitle={(subtitle) =>
                handleDownloadSubtitle(subtitle)
              }
            />
          </div>
          <button
            className="btn btn-success sticky-bottom d-flex justify-content-center"
            disabled={!isValidToSave}
            onClick={handleBrowse}
          >
            <IconWithText name="save">Save</IconWithText>
          </button>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default PrepareToMKVToolNix;
