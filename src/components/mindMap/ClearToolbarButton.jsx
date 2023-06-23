import { ClearOutlined as ClearOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';

export const ClearToolbarButton = () => {
  const onClick = () => console.log('ClearToolbarButton');

  return <BaseToolbarButton title="Làm mới" icon={<ClearOutlinedIcon />} callback={onClick} />;
};
