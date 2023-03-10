import * as dateFns from 'date-fns';
import distinctColors from 'distinct-colors';

import Icon from './Icon';

interface SelectSubtitleProps {
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

const SelectSubtitle = ({
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
          <th scope="col">Download</th>
        </tr>
      </thead>
      <tbody>
        {subtitles.map((subtitle) => {
          return (
            <tr
              key={subtitle.id}
              className={
                subtitle.id === selectedSubtitle?.id ? 'is-active' : ''
              }
              onClick={() =>
                onSelectSubtitle ? onSelectSubtitle(subtitle) : {}
              }
            >
              <td>
                <p className="m-0">{subtitle.fileName}</p>
                <span className="credit">{subtitle.credit}</span>
              </td>
              <td>{subtitle.downloads}</td>
              <td>{dateFns.format(subtitle.uploadDate, 'dd/MM/yyyy')}</td>
              <td
                style={{
                  color: '#fff',
                  backgroundColor: uniqueSubtitleColors[subtitle.fileSize],
                }}
              >
                {subtitle.fileSize}
              </td>
              <td
                onClick={() =>
                  onDownloadSubtitle ? onDownloadSubtitle(subtitle) : {}
                }
              >
                <Icon name="download" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SelectSubtitle;
