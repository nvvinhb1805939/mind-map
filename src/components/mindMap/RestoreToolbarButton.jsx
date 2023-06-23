import { SettingsBackupRestoreOutlined as SettingsBackupRestoreOutlinedIcon } from '@mui/icons-material';
import { BaseToolbarButton } from './BaseToolbarButton';

export const RestoreToolbarButton = () => {
  const onClick = () => console.log('RestoreToolbarButton');

  return (
    <BaseToolbarButton
      title="Khôi phục"
      icon={<SettingsBackupRestoreOutlinedIcon />}
      callback={onClick}
    />
  );
};
