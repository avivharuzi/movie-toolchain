import { CopyText } from './CopyText';

export interface MovieDetailsStatProps {
  text: string;
}

export const MovieDetailsStat = ({ text }: MovieDetailsStatProps) => {
  return (
    <h5 className="d-flex align-items-center gap-3">
      <span>{text}</span>
      <CopyText text={text} />
    </h5>
  );
};
