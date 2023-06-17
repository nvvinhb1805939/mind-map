import { AppBar, Box, Toolbar } from '@mui/material';
import { AddNodePopup } from 'src/components/mindMap';
import { HEADER, POSITION } from 'src/config-global';

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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

Header.propTypes = {};
