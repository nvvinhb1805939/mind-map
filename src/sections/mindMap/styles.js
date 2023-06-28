import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSettingsContext } from 'src/components/settings';
import { DEFAULT_NODE_BG_COLOR, HANDLE_SIZE, MIND_MAP_CLASSES, TYPES } from 'src/config-global';

export const useStyles = () => {
  const { themeMode } = useSettingsContext();
  const {
    mindMap: { bgcolor },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const style = useMemo(
    () => ({
      /** style for react-flow wrapper */
      position: 'relative',
      bgcolor,
      height: '100%',
      borderRadius: 1,

      '&.selected': {
        outline: (theme) => `4px solid ${theme.palette.primary.main}`,
        boxShadow: (theme) =>
          themeMode === 'dark'
            ? `0 0 10px 16px ${theme.palette.primary.dark}`
            : `0 0 10px 16px ${theme.palette.primary.lighter}`,
      },

      /** Style for attribution */
      '& .react-flow__attribution': {
        display: 'none',
      },

      /** Style for Nodes */
      [`& .react-flow__node.selected .${MIND_MAP_CLASSES.NODE}, & .react-flow__node.dragging .${MIND_MAP_CLASSES.NODE}`]:
        {
          borderColor: 'primary.main',
          boxShadow: (theme) =>
            themeMode === 'dark'
              ? `0 0 5px 5px ${theme.palette.primary.dark}`
              : `0 0 5px 5px ${theme.palette.primary.lighter}`,
          color: 'primary.main',
        },

      /** Style for Edges */
      // '& .react-flow__edge-path':{
      //   stroke
      // },
      '& .react-flow__edge:hover .react-flow__edge-path, & .react-flow__connection-path, & .react-flow__edge.updating .react-flow__edge-path, & .react-flow__edge:focus .react-flow__edge-path, & .react-flow__edge:focus-visible .react-flow__edge-path':
        {
          stroke: (theme) => `${theme.palette.primary.main} !important`,
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
    [themeMode, bgcolor]
  );

  return style;
};
