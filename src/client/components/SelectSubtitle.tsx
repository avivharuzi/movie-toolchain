import * as dateFns from 'date-fns';

import Icon from './Icon';

interface SelectSubtitleProps {
  subtitles: MovieSubtitle[];
  selectedSubtitle: MovieSubtitle | null;
  onSelectSubtitle?: (subtitle: MovieSubtitle) => void;
  onDownloadSubtitle?: (subtitle: MovieSubtitle) => void;
}

const SelectSubtitle = ({
  subtitles,
  selectedSubtitle,
  onSelectSubtitle,
  onDownloadSubtitle,
}: SelectSubtitleProps) => {
  return (
    <table className="select-subtitle table bg-white table-bordered table-hover">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Downloads</th>
          <th scope="col">Upload Date</th>
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
              <td>{subtitle.fileName}</td>
              <td>{subtitle.downloads}</td>
              <td>{dateFns.format(subtitle.uploadDate, 'dd/MM/yyyy')}</td>
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
