import { UndoOutlined as UndoOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';

export const UndoToolbarButton = () => {
  const onClick = () => console.log('UndoToolbarButton');

  return <BaseToolbarButton title="Hoàn tác" icon={<UndoOutlinedIcon />} callback={onClick} />;
};
