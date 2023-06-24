import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSettingsContext } from 'src/components/settings';
import { HANDLE_SIZE, TYPES } from 'src/config-global';
import { presentMindMap } from 'src/redux/slices/mindMap';

export const useStyles = () => {
  const { themeMode } = useSettingsContext();
  const { bgcolor } = useSelector(presentMindMap);

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
      '& .react-flow__edge:hover .react-flow__edge-path, & .react-flow__edge.selected .react-flow__edge-path, & .react-flow__connection-path, & .react-flow__edge.updating .react-flow__edge-path, & .react-flow__edge:focus .react-flow__edge-path, & .react-flow__edge:focus-visible .react-flow__edge-path':
        {
          stroke: (theme) => `${theme.palette.primary.main}`,
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
