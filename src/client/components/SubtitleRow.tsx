import { format } from 'date-fns';
import { useState } from 'react';

import { Icon } from './Icon';
import { PreviewSubtitle } from './PreviewSubtitle';
import { useToast } from './Toast';

export interface SubtitleRowProps {
  ktuvitId: string;
  subtitle: MovieSubtitle;
  isSelected: boolean;
  uniqueColor: string;
  onSelectSubtitle?: (subtitle: MovieSubtitle) => void;
  onDownloadSubtitle?: (subtitle: MovieSubtitle) => void;
}

export const SubtitleRow = ({
  ktuvitId,
  subtitle,
  isSelected,
  uniqueColor,
  onSelectSubtitle,
  onDownloadSubtitle,
}: SubtitleRowProps) => {
  const [subtitlePreviewIsLoading, setSubtitlePreviewIsLoading] =
    useState<boolean>(false);
  const [subtitlePreview, setSubtitlePreview] = useState<string>('');

  const { showToast } = useToast();

  const handlePreviewSubtitleClick = async () => {
    if (subtitlePreview) {
      return;
    }

    setSubtitlePreviewIsLoading(true);

    try {
      const content = await window.electronAPI.previewSubtitle({
        ktuvitID: ktuvitId,
        subtitleID: subtitle.id,
      });

      setSubtitlePreview(content);
    } catch (error) {
      showToast(
        `Failed to get subtitle preview, error: ${error.toString()}`,
        'error'
      );
    } finally {
      setSubtitlePreviewIsLoading(false);
    }
  };

  return (
    <tr
      className={isSelected ? 'is-active' : ''}
      onClick={() => (onSelectSubtitle ? onSelectSubtitle(subtitle) : {})}
    >
      <td>
        <p className="m-0">{subtitle.fileName}</p>
        <span className="credit">{subtitle.credit}</span>
      </td>
      <td>{subtitle.downloads}</td>
      <td>{format(subtitle.uploadDate, 'dd/MM/yyyy')}</td>
      <td
        style={{
          color: '#fff',
          backgroundColor: uniqueColor,
        }}
      >
        {subtitle.fileSize}
      </td>
      <td>
        <PreviewSubtitle
          title={subtitle.fileName}
          onClickOpen={handlePreviewSubtitleClick}
          onClickDownload={() =>
            onDownloadSubtitle ? onDownloadSubtitle(subtitle) : {}
          }
          content={subtitlePreview}
          isLoading={subtitlePreviewIsLoading}
        />
      </td>
      <td>
        <button
          className="btn btn-info"
          onClick={(event) => {
            onDownloadSubtitle ? onDownloadSubtitle(subtitle) : {};
            event.stopPropagation();
          }}
        >
          <Icon name="download" />
        </button>
      </td>
    </tr>
  );
};
