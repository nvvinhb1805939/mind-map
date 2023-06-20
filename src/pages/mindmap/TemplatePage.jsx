import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';

const TemplatePage = (props) => {
  const [color, setColor] = useState('#ac12e');

  const onChange = (color, event) => {
    setColor(color.rgb);
  };
  return <ChromePicker color={color} onChange={onChange} />;
};

export default TemplatePage;
