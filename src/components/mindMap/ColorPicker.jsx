import { Box } from '@mui/material';
import { useEffect } from 'react';
import { ColorPicker as ColorPickerPalette, toColor, useColor } from 'react-color-palette';
import { useSelector } from 'react-redux';
import { useSettingsContext } from '../settings';
import { BasePopper } from './BasePopper';

export const ColorPicker = (props) => {
  const {
    id = '',
    onChangeComplete,
    initialColor = '#ffffff',
    tooltip = '',
    icon = null,
    buttonStyles = {},
  } = props;

  const { themeMode } = useSettingsContext();

  const { openId } = useSelector((state) => state.popper);

  const [color, setColor] = useColor('hex', initialColor);

  useEffect(() => {
    if (initialColor === color.hex) return;

    const newColor = toColor('hex', initialColor);

    setColor(newColor);
  }, [initialColor]);

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
      <BasePopper
        id={id}
        tooltip={tooltip}
        icon={icon}
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
        {openId === id && (
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
        )}
      </BasePopper>
    </Box>
  );
};
