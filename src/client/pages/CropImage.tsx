import { ChangeEvent } from 'react';

const CropImage = () => {
  const handleFileChange = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    const file = target.files && target.files[0];

    if (!file) {
      return;
    }

    console.log('file', file);
  };

  return (
    <div>
      <div className="mb-3">
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
    </div>
  );
};

export default CropImage;
