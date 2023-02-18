// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Icon from './Icon';

export interface CopyTextProps {
  text: string;
}

const CopyText = ({ text }: CopyTextProps) => {
  return (
    <CopyToClipboard text={text}>
      <button className="btn btn-sm btn-warning">
        <Icon name="clipboard" />
      </button>
    </CopyToClipboard>
  );
};

export default CopyText;
