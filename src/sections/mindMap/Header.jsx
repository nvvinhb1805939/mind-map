import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import { HEADER } from 'src/config-global';

export const Header = (props) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <AppBar position="absolute" color="transparent" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar></Toolbar>
      </AppBar>
    </Box>
  );
};

Header.propTypes = {};
