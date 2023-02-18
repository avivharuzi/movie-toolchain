export const getAspectRatio = (
  width: number,
  height: number,
  isCameraRatio = false
): string => {
  const gcd = (w: number, h: number): number => {
    return h ? gcd(h, w % h) : w;
  };

  const ratio = gcd(width, height);

  const widthRatio = width / ratio;
  const heightRatio = height / ratio;

  if (!isCameraRatio) {
    return `${widthRatio}:${heightRatio}`;
  }

  const newWidthRatio = Number((widthRatio / heightRatio).toFixed(2));

  return `${newWidthRatio}:1`;
};
