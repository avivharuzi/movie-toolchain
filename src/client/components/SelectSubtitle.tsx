import distinctColors from 'distinct-colors';

import { SubtitleRow } from './SubtitleRow';

interface SelectSubtitleProps {
  ktuvitId: string;
  subtitles: MovieSubtitle[];
  selectedSubtitle: MovieSubtitle | null;
  onSelectSubtitle?: (subtitle: MovieSubtitle) => void;
  onDownloadSubtitle?: (subtitle: MovieSubtitle) => void;
}

const createUniqueSubtitleColors = (
  subtitles: MovieSubtitle[]
): Record<string, string> => {
  const uniqueSubtitles = new Set(
    subtitles.map((subtitle) => subtitle.fileSize)
  );

  const colors = distinctColors({
    count: uniqueSubtitles.size,
  });

  return [...uniqueSubtitles].reduce((curr, sub, index) => {
    curr[sub] = colors[index]?.hex() || 'inherit';

    return curr;
  }, {} as Record<string, string>);
};

export const SelectSubtitle = ({
  ktuvitId,
  subtitles,
  selectedSubtitle,
  onSelectSubtitle,
  onDownloadSubtitle,
}: SelectSubtitleProps) => {
  const uniqueSubtitleColors = createUniqueSubtitleColors(subtitles);

  return (
    <table className="select-subtitle table bg-white table-bordered table-hover">
      <thead>
        <tr>
          <th className="w-75" scope="col">
            Name
          </th>
          <th scope="col">Downloads</th>
          <th scope="col">Upload Date</th>
          <th scope="col">Size</th>
          <th scope="col">Preview</th>
          <th scope="col">Download</th>
        </tr>
      </thead>
      <tbody>
        {subtitles.map((subtitle) => (
          <SubtitleRow
            key={subtitle.id}
            ktuvitId={ktuvitId}
            subtitle={subtitle}
            isSelected={subtitle.id === selectedSubtitle?.id}
            uniqueColor={uniqueSubtitleColors[subtitle.fileSize]}
            onSelectSubtitle={onSelectSubtitle}
            onDownloadSubtitle={onDownloadSubtitle}
          />
        ))}
      </tbody>
    </table>
  );
};
