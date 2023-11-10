import { Modal } from 'bootstrap';
import { useEffect, useRef, useState } from 'react';

import { Icon } from './Icon';
import { Loader } from './Loader';

export interface PreviewSubtitleProps {
  isLoading: boolean;
  title: string;
  content?: string;
  onClickOpen: () => void;
  onClickDownload: () => void;
}

export const PreviewSubtitle = ({
  isLoading,
  title,
  content,
  onClickOpen,
  onClickDownload,
}: PreviewSubtitleProps) => {
  const [modal, setModal] = useState<Modal | null>(null);

  const modalRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setModal(new Modal(modalRef.current));
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        onClick={(event) => {
          event.stopPropagation();
          modal?.show();
          onClickOpen();
        }}
      >
        <Icon name="eye" />
      </button>

      <div
        className="modal fade"
        tabIndex={-1}
        aria-hidden="true"
        ref={modalRef}
        style={{
          color: 'black',
          cursor: 'default',
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <Loader isLoading={isLoading} />
            <div className="modal-header">
              <h1 className="modal-title fs-5">{title}</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <pre>{content}</pre>
            </div>
            <div className="modal-footer">
              <div className="d-flex flex-row justify-content-between w-100">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  className="btn btn-info"
                  onClick={(event) => {
                    onClickDownload();
                    modal?.hide();
                    event.stopPropagation();
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
