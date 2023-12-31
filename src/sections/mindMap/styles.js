import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSettingsContext } from 'src/components/settings';
import { HANDLE_SIZE, NODE_SIZE, TYPES } from 'src/config-global';
import { INITIAL_MIND_MAP } from 'src/redux/slices/mindMap';

export const useStyles = () => {
  const { themeMode } = useSettingsContext();
  const {
    mindMap: { bgcolor, selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const style = useMemo(
    () => ({
      /** style for react-flow wrapper */
      position: 'relative',
      height: '100%',
      bgcolor: themeMode === 'dark' && bgcolor === INITIAL_MIND_MAP.bgcolor ? '#212B36' : bgcolor,
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
      '& .react-flow__node': {
        minWidth: NODE_SIZE.WIDTH,
        height: 'max-content !important',
      },

      /** Style for Edges */
      '& .react-flow__edge .react-flow__edge-path': {
        filter: (theme) =>
          `drop-shadow(0px 0px 1px ${theme.palette.grey[300]}) drop-shadow(0px 0px 1px ${theme.palette.grey[300]})`,
      },
      '& .react-flow__edge:hover .react-flow__edge-path, & .react-flow__connection-path': {
        filter: (theme) =>
          `drop-shadow(0px 0px 4px ${theme.palette.grey[300]}) drop-shadow(0px 0px 4px ${theme.palette.grey[300]})`,
        strokeWidth: 4,
      },
      '& .react-flow__edge.selected .react-flow__edge-path': {
        strokeWidth: 4,
        filter: (theme) =>
          `drop-shadow(0px 0px 4px ${theme.palette.grey[300]}) drop-shadow(0px 0px 4px ${theme.palette.grey[300]})`,
      },

      /** Style for Handles */
      '& .react-flow__handle': {
        width: HANDLE_SIZE.WIDTH,
        height: HANDLE_SIZE.HEIGHT,
        borderRadius: 0.5,
      },
      '& .react-flow__handle-top': {
        top: -HANDLE_SIZE.HEIGHT / 2,
      },
      '& .react-flow__handle-bottom': {
        bottom: -HANDLE_SIZE.HEIGHT / 2,
      },
    }),
    [themeMode, bgcolor, selected]
  );

  return style;
};
