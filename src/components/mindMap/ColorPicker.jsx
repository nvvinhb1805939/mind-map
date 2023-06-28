import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { ColorPicker as ColorPickerPalette, useColor } from 'react-color-palette';
import { useSettingsContext } from '../settings';
import { BasePopover } from './BasePopover';

export const ColorPicker = (props) => {
  const { onChangeComplete, initialColor = '#fff', tooltip = '', icon = null } = props;

  const { themeMode } = useSettingsContext();

  const [color, setColor] = useColor('hex', initialColor);

  const [close, setClose] = useState(false);

  useEffect(() => {
    return () => setClose(false);
  });

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
            onChange={setColor}
            onChangeComplete={onChangeComplete}
            hideHSV
            dark={themeMode === 'dark'}
          />
        </Box>
      </BasePopover>
    </Box>
  );
};
