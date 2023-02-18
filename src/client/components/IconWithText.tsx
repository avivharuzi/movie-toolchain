import { PropsWithChildren } from 'react';

import Icon from './Icon';

export interface IconWithTextProps extends PropsWithChildren {
  name: string;
}

const IconWithText = ({ name, children }: IconWithTextProps) => {
  return (
    <div className="d-flex align-items-center gap-2">
      <Icon name={name} />
      <div>{children}</div>
    </div>
  );
};

export default IconWithText;
