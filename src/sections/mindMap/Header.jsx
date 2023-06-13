import { AppBar, Box, Toolbar } from '@mui/material';
import { HEADER } from 'src/config-global';

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
      <AppBar position="absolute" color="transparent" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar></Toolbar>
      </AppBar>
    </Box>
  );
};

Header.propTypes = {};
