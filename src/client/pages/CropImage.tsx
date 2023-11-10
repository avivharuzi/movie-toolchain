import { ChangeEvent, useEffect, useState } from 'react';

import {
  CropImageForm,
  CropImageFormValues,
  getCropImageFormDefaultValues,
} from '../components/CropImageForm';
import { ImageWithZoom } from '../components/ImageWithZoom';
import { fromFileToDataURL, getImageResolution } from '../utils';

interface ImageProperties {
  src: string;
  width: number;
  height: number;
}

interface OriginalImageProperties extends ImageProperties {
  path: string;
}

export const CropImage = () => {
  const [originalImage, setOriginalImage] =
    useState<OriginalImageProperties>(null);
  const [croppedImage, setCroppedImage] = useState<ImageProperties>(null);
  const [originalImageBlackBars, setOriginalImageBlackBars] =
    useState<ImageBlackBars>(null);
  const [cropImageFormValues, setCropImageFormValues] =
    useState<CropImageFormValues>(getCropImageFormDefaultValues());

  const handleFileChange = async (event: ChangeEvent): Promise<void> => {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) {
      return;
    }

    resetAll();

    await updateOriginalImage(file);
  };

  useEffect(() => {
    updateCroppedImage().then();
  }, [originalImage, cropImageFormValues]);

  const updateOriginalImage = async (file: File): Promise<void> => {
    const src = await fromFileToDataURL(file);

    const { width, height } = await getImageResolution(src);

    const imageBlackBars = await window.electronAPI.getImageBlackBars(
      file.path
    );

    setOriginalImage({
      src,
      width,
      height,
      path: file.path,
    });

    setOriginalImageBlackBars(imageBlackBars);

    setCropImageFormValues({
      top: imageBlackBars.top,
      right: imageBlackBars.right,
      bottom: imageBlackBars.bottom,
      left: imageBlackBars.left,
    });
  };

  const updateCroppedImage = async (): Promise<void> => {
    if (!originalImage) {
      return;
    }

    const src = await window.electronAPI.cropImageBase64({
      image: originalImage.path,
      ...cropImageFormValues,
    });

    const { width, height } = await getImageResolution(src);

    setCroppedImage({
      src,
      width,
      height,
    });
  };

  const onSubmitCropImageForm = async (
    values: CropImageFormValues
  ): Promise<void> => {
    setCropImageFormValues(values);
  };

  const resetAll = () => {
    setOriginalImage(null);
    setCroppedImage(null);
    setCropImageFormValues(getCropImageFormDefaultValues());
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <label htmlFor="selectImage" className="form-label">
          Select image:
        </label>
        <input
          className="form-control"
          type="file"
          id="selectImage"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {originalImage && originalImageBlackBars && croppedImage ? (
        <div className="d-flex gap-4">
          <div className="w-25">
            <p className="text-muted">Original image:</p>
            <p>
              {originalImage.width}x{originalImage.height}
            </p>
            <div>
              <ImageWithZoom src={originalImage.src} alt="Original Image" />
            </div>
          </div>
          <div className="w-75">
            <div className="d-flex gap-4">
              <div className="w-75">
                <p className="text-muted">Cropped image:</p>
                <p>
                  {croppedImage.width}x{croppedImage.height}
                </p>
              </div>
              <div className="w-25">
                <p className="text-muted">Black bars detection:</p>
                <p>
                  {originalImageBlackBars.croppedWidth}x
                  {originalImageBlackBars.croppedHeight}
                </p>
                <p>
                  top:{' '}
                  <span className="text-primary">
                    {originalImageBlackBars.top}
                  </span>{' '}
                  right:{' '}
                  <span className="text-primary">
                    {originalImageBlackBars.right}
                  </span>{' '}
                  bottom:{' '}
                  <span className="text-primary">
                    {originalImageBlackBars.bottom}
                  </span>{' '}
                  left:{' '}
                  <span className="text-primary">
                    {originalImageBlackBars.left}
                  </span>
                </p>
              </div>
            </div>
            <div className="d-flex align-items-start gap-4 w-100">
              <div className="d-flex w-75 flex-column gap-3">
                <ImageWithZoom
                  src={croppedImage.src}
                  initialPositionY={0}
                  initialScale={32}
                  alt="Cropped Image Top"
                />
                <ImageWithZoom
                  src={croppedImage.src}
                  initialPositionY={-croppedImage.height * 32}
                  initialScale={32}
                  alt="Cropped Image Bottom"
                />
                <ImageWithZoom
                  src={croppedImage.src}
                  alt="Cropped Image Center"
                />
              </div>
              <div className="w-25">
                <CropImageForm
                  values={cropImageFormValues}
                  onSubmit={(values) => onSubmitCropImageForm(values)}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};
