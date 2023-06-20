import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { AddNodePopup, ImportBox } from 'src/components/mindMap';
import { DownloadContextMenu } from 'src/components/mindMap/DownloadContextMenu';

export const Header = (props) => {
  const { isEdit } = props;

  return (
    <Box
      sx={{
        position: 'relative',
        transform: `translateY(-100%)`,
        ...(isEdit && {
          transform: `translateY(100%)`,
        }),
      }}
    >
      <AppBar position="absolute" color="transparent" sx={{ px: 1, bgcolor: 'background.paper' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <AddNodePopup />
          <DownloadContextMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Header.propTypes = {};
