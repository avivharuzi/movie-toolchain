import { ChangeEvent } from 'react';

import { fromFileToDataURL } from '../utils';

const CropImage = () => {
  const handleFileChange = async (event: ChangeEvent): Promise<void> => {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) {
      return;
    }

    await updateImage(file);
  };

  const updateImage = async (file: File): Promise<void> => {
    const imageDataURL = await fromFileToDataURL(file);
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
      <div>Original image:</div>
      <div>Cropped image:</div>
    </div>
  );
};

export default CropImage;
