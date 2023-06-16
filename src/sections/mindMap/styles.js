import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { HANDLE_SIZE } from 'src/config-global';

export const useStyles = () => {
  const { presetsColor } = useSettingsContext();
  const theme = useTheme();

  const style = useMemo(
    () => ({
      /** style for react-flow wrapper */
      position: 'relative',
      bgcolor: 'background.paper',
      height: '100%',
      borderRadius: 1,

      /** Style for Edge */
      '& .react-flow__edge:hover .react-flow__edge-path': {
        stroke: '#555', // default stroke color of react-flow
      },

      /** Style for Handle */
      '& .react-flow__handle': {
        width: HANDLE_SIZE.WIDTH,
        height: HANDLE_SIZE.HEIGHT,
        borderRadius: 0.5,
        bgcolor: 'primary.main',
      },
      '& .react-flow__handle-top': {
        top: -HANDLE_SIZE.HEIGHT / 2,
      },
      '& .react-flow__handle-bottom': {
        bottom: -HANDLE_SIZE.HEIGHT / 2,
      },
    }),
    [presetsColor]
  );

  return style;
};
