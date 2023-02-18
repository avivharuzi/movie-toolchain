export interface SelectImageProps {
  images: MovieImage[];
  selectedImage: MovieImage | null;
  onSelectImage?: (image: MovieImage) => void;
}

const SelectImage = ({
  images,
  selectedImage,
  onSelectImage,
}: SelectImageProps) => {
  return (
    <div className="select-image d-flex overflow-scroll gap-4">
      {images.map((image, index) => {
        return (
          <figure
            onClick={() => (onSelectImage ? onSelectImage(image) : {})}
            className={`figure ${
              image.id === selectedImage?.id ? 'is-active' : ''
            }`}
            key={image.id}
          >
            <img
              src={image.src.w500}
              className="figure-img rounded"
              height={200}
              alt={`select-image-${index}`}
            />
            <figcaption className="figure-caption">
              <span>
                {image.width}x{image.height}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
};

export default SelectImage;
