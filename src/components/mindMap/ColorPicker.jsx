import { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { BasePopover } from './BasePopover';
import { changeBgColor } from 'src/redux/slices/mindMap';
import { Box } from '@mui/material';

export const ColorPicker = (props) => {
  const dispatch = useDispatch();
  const { bgcolor } = useSelector((state) => state[TYPES.MIND_MAP]);

  const [close, setClose] = useState(false);
  const [color, setColor] = useState(bgcolor);

  useEffect(() => {
    return () => setClose(false);
  });

  const onChange = ({ hex }, event) => {
    setColor(hex);

    dispatch(changeBgColor(hex));
  };

  return (
    <BasePopover
      id="color-pikcer"
      close={close}
      buttonStyles={{
        p: 0,
        minWidth: 'unset',
        width: 40,
        height: 40,

        '&:hover': { bgcolor, boxShadow: 11 },

        bgcolor,
        borderRadius: 1,
        boxShadow: 11,
      }}
    >
      <Box sx={{ p: 2, '& .chrome-picker': { boxShadow: 'unset !important' } }}>
        <ChromePicker color={color} disableAlpha onChange={onChange} />
      </Box>
    </BasePopover>
  );
};
