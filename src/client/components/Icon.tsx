export interface IconProps {
  name: string;
}

const Icon = ({ name }: IconProps) => {
  return <i className={`bi bi-${name}`}></i>;
};

export default Icon;
