import { RedoOutlined as RedoOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';

export const RedoToolbarButton = () => {
  const onClick = () => console.log('RedoToolbarButton');

  return <BaseToolbarButton title="Làm lại" icon={<RedoOutlinedIcon />} callback={onClick} />;
};
