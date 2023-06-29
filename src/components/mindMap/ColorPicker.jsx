import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ColorPicker as ColorPickerPalette, useColor } from 'react-color-palette';
import { useSettingsContext } from '../settings';
import { BasePopover } from './BasePopover';

export const ColorPicker = (props) => {
  const {
    onChangeComplete,
    initialColor = '#ffffff',
    tooltip = '',
    icon = null,
    buttonStyles = {},
  } = props;

  const { themeMode } = useSettingsContext();

  const [color, setColor] = useColor('hex', initialColor);

  const [close, setClose] = useState(false);

  useEffect(() => {
    return () => setClose(false);
  });

  useEffect(() => {
    if (color.hex === initialColor) return;

    const delayTimer = setTimeout(() => {
      onChangeComplete(color);
    }, 250);

    return () => clearTimeout(delayTimer);
  }, [color]);

  const handleColorChange = (color) => {
    setColor(color);
  };

  return (
    <Box onClick={(event) => event.stopPropagation()}>
      <BasePopover
        id="color-pikcer"
        hasDispatch={true}
        tooltip={tooltip}
        icon={icon}
        close={close}
        buttonStyles={{
          p: 0,
          minWidth: 'unset',
          width: 40,
          height: 40,

          '&:hover': { bgcolor: initialColor, boxShadow: 11 },

          bgcolor: initialColor,
          borderRadius: 1,
          boxShadow: 11,

          ...buttonStyles,
        }}
      >
        <Box
          onClick={(event) => event.stopPropagation()}
          sx={{ p: 2, '& .rcp-saturation': { borderRadius: 1 } }}
        >
          <ColorPickerPalette
            width={456}
            height={228}
            color={color}
            onChange={handleColorChange}
            hideHSV
            dark={themeMode === 'dark'}
          />
        </Box>
      </BasePopover>
    </Box>
  );
};
