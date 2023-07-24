import { Button, Tooltip } from '@mui/material';

export const BaseTooltipButton = (props) => {
  const { title, action, icon } = props;

  return (
    <Tooltip title={title} disableInteractive>
      <Button
        onClick={action}
        sx={{ minWidth: 'unset', width: '40px !important', height: '40px !important' }}
        variant="outlined"
        color="inherit"
      >
        {icon}
      </Button>
    </Tooltip>
  );
};
