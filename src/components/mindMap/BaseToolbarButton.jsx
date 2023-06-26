import { Box, IconButton, Tooltip } from '@mui/material';

export const BaseToolbarButton = (props) => {
  const { icon, title, disabled = false, callback } = props;

  return (
    <Tooltip title={title} disableInteractive>
      <Box>
        <IconButton onClick={callback} disabled={disabled}>
          {icon}
        </IconButton>
      </Box>
    </Tooltip>
  );
};
