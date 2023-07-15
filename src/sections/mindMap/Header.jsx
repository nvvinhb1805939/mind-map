import { AppBar, Box, Stack, Toolbar } from '@mui/material';
import { useSelector } from 'react-redux';
import {
  AddNodePopup,
  DownloadContextMenu,
  EditModeRendering,
  ImportBox,
} from 'src/components/mindMap';
import { TYPES } from 'src/config-global';

export const Header = () => {
  const {
    mindMap: { copied },
  } = useSelector((state) => state[TYPES.MIND_MAP]);
  console.log(copied);

  return (
    <Box
      sx={{
        position: 'relative',
        transform: `translateY(-100%)`,
        zIndex: 'fab',
      }}
    >
      <AppBar
        onClick={(event) => event.stopPropagation()}
        position="absolute"
        color="transparent"
        sx={{ px: 1, bgcolor: 'background.paper' }}
      >
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
