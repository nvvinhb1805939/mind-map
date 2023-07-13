import { AppBar, Box, Stack, Toolbar } from '@mui/material';
import {
  AddNodePopup,
  DownloadContextMenu,
  EditModeRendering,
  ImportBox,
} from 'src/components/mindMap';

export const Header = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        transform: `translateY(-100%)`,
        zIndex: 'fab',
      }}
    >
      <AppBar position="absolute" color="transparent" sx={{ px: 1, bgcolor: 'background.paper' }}>
        <Toolbar sx={{ justifyContent: 'flex-start', gap: 4 }}>
          <AddNodePopup />
          <EditModeRendering />
          <Stack direction="row" gap={1} sx={{ ml: 'auto' }}>
            <ImportBox />
            <DownloadContextMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
