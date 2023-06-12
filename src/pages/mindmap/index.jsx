import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Header, Main } from 'src/sections/mindMap';

const MindMapPage = (props) => {
  return (
    <>
      <Header />
      <Main />
    </>
  );
};

MindMapPage.propTypes = {};

export default MindMapPage;
