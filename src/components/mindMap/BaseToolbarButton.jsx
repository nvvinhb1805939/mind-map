import { IconButton, Tooltip } from '@mui/material';

export const BaseToolbarButton = (props) => {
  const { icon, title, callback } = props;

  return (
    <Tooltip title={title} disableInteractive>
      <IconButton onClick={callback}>{icon}</IconButton>
    </Tooltip>
  );
};
