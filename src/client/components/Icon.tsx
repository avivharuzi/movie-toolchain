export interface IconProps {
  name: string;
}

export const Icon = ({ name }: IconProps) => {
  return <i className={`bi bi-${name}`}></i>;
};
