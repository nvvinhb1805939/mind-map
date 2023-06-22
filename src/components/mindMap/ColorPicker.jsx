import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ColorPicker as ColorPickerPalette, useColor } from 'react-color-palette';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { useSettingsContext } from '../settings';
import { BasePopover } from './BasePopover';

export const ColorPicker = (props) => {
  const { onChangeComplete } = props;

  const { bgcolor } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { themeMode } = useSettingsContext();

  const [color, setColor] = useColor('hex', bgcolor);

  const [close, setClose] = useState(false);

  useEffect(() => {
    return () => setClose(false);
  });

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
      <Box sx={{ p: 2, '& .rcp-saturation': { borderRadius: 1 } }}>
        <ColorPickerPalette
          width={456}
          height={228}
          color={color}
          onChange={setColor}
          onChangeComplete={onChangeComplete}
          hideHSV
          dark={themeMode === 'dark'}
        />
      </Box>
    </BasePopover>
  );
};
