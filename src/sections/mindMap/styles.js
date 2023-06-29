import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSettingsContext } from 'src/components/settings';
import {
  DEFAULT_EDGE_COLOR,
  DEFAULT_NODE_BORDER_COLOR,
  HANDLE_SIZE,
  MIND_MAP_CLASSES,
  TYPES,
} from 'src/config-global';

export const useStyles = () => {
  const { themeMode } = useSettingsContext();
  const {
    mindMap: { bgcolor, selected },
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
          filter: `drop-shadow(0 0 20px ${
            selected?.[0]?.element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR
          }) drop-shadow(0 0 50px ${
            selected?.[0]?.element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR
          })`,
        },

      /** Style for Edges */
      '& .react-flow__edge:hover .react-flow__edge-path, & .react-flow__connection-path': {
        stroke: (theme) => `${theme.palette.primary.main} !important`,
      },
      '& .react-flow__edge.selected .react-flow__edge-path': {
        stroke: `${selected?.[0]?.element?.style?.stroke || DEFAULT_EDGE_COLOR} !important`,
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
