import { AppBar, Box, Toolbar } from '@mui/material';
import { AddNodePopup, DownloadContextMenu, EditModeRendering } from 'src/components/mindMap';

export const Header = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        transform: `translateY(-100%)`,
      }}
    >
      <AppBar position="absolute" color="transparent" sx={{ px: 1, bgcolor: 'background.paper' }}>
        <Toolbar sx={{ justifyContent: 'flex-start', gap: 4 }}>
          <AddNodePopup />
          <EditModeRendering />
          <Box sx={{ ml: 'auto' }}>
            <DownloadContextMenu />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
