import { useMemo } from 'react';
import { useSettingsContext } from 'src/components/settings';
import { HANDLE_SIZE, TYPES } from 'src/config-global';

export const useStyles = () => {
  const { presetsColor, themeMode } = useSettingsContext();

  const style = useMemo(
    () => ({
      /** style for react-flow wrapper */
      position: 'relative',
      bgcolor: 'background.paper',
      height: '100%',
      borderRadius: 1,

      /** Style for Nodes */
      [`& .react-flow__node.selected .${TYPES.MIND_MAP}, & .react-flow__node.dragging .${TYPES.MIND_MAP}`]:
        {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            themeMode === 'dark'
              ? `0 0 5px 5px ${theme.palette.primary.dark}`
              : `0 0 5px 5px ${theme.palette.primary.lighter}`,
          color: 'primary.main',
        },

      /** Style for Edges */
      '& .react-flow__edge:hover .react-flow__edge-path': {
        stroke: '#555', // default stroke color of react-flow
      },

      /** Style for Handles */
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
    [presetsColor, themeMode]
  );

  return style;
};