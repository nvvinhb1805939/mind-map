import { CloudDoneOutlined as CloudDoneOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';

export const SaveToolbarButton = () => {
  const onClick = () => console.log('SaveToolbarButton');

  return <BaseToolbarButton title="Lưu" icon={<CloudDoneOutlinedIcon />} callback={onClick} />;
};
