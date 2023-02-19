import { Fragment } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import Icon from './Icon';

export interface ImageWithZoomProps {
  src: string;
  alt: string;
  initialScale?: number;
  initialPositionX?: number;
  initialPositionY?: number;
}

const ImageWithZoom = ({
  src,
  alt,
  initialScale,
  initialPositionX,
  initialPositionY,
}: ImageWithZoomProps) => {
  return (
    <div className="d-flex flex-column gap-2 w-100">
      <TransformWrapper
        maxScale={64}
        initialScale={initialScale || 1}
        initialPositionX={initialPositionX || 0}
        initialPositionY={initialPositionY || 0}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <Fragment>
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary d-flex align-items-center"
                onClick={() => zoomIn()}
              >
                <Icon name="zoom-in" />
              </button>
              <button
                className="btn btn-secondary d-flex align-items-center"
                onClick={() => zoomOut()}
              >
                <Icon name="zoom-out" />
              </button>
              <button
                className="btn btn-secondary d-flex align-items-center"
                onClick={() => resetTransform()}
              >
                <Icon name="x-circle" />
              </button>
            </div>
            <TransformComponent>
              <img className="w-100" src={src} alt={alt} />
            </TransformComponent>
          </Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default ImageWithZoom;
