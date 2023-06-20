import { Box } from '@mui/material';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';

export const ColorPicker = (props) => {
  const { bgcolor } = useSelector((state) => state[TYPES.MIND_MAP]);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState(bgcolor);

  const onClick = (event) => {
    event.stopPropagation();

    setDisplayColorPicker(true);
  };

  const onChange = (color, event) => {
    setColor(color.rgb);
  };

  return (
    <Box onClick={onClick} sx={{ position: 'relative', cursor: 'pointer' }}>
      <Box sx={{ width: 40, height: 40, bgcolor, borderRadius: 1, boxShadow: 11 }} />
      {displayColorPicker && (
        <Box sx={{ position: 'absolute', top: 0 }}>
          <ChromePicker color={color} onChange={onChange} />
        </Box>
      )}
    </Box>
  );
};
