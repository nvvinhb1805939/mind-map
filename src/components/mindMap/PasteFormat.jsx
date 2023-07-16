import { FormatPaintOutlined as FormatPaintOutlinedIcon } from '@mui/icons-material';
import { Box, Button, Tooltip } from '@mui/material';

export const PasteFormat = (props) => {
  const { selected, copied } = props;

  const pasteFormat = () => {};

  return (
    <Tooltip title="Dán định dạng" disableInteractive>
      <Box>
        <Button
          onClick={pasteFormat}
          sx={{ minWidth: 'unset', width: '40px !important', height: '40px !important' }}
          variant="outlined"
          disabled={copied?.copy_type !== selected[0].type}
          color="inherit"
        >
          <FormatPaintOutlinedIcon />
        </Button>
      </Box>
    </Tooltip>
  );
};
