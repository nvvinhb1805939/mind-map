import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BaseEdge, getBezierPath } from 'reactflow';
import { DEFAULT_EDGE_COLOR, EDIT_MODES, TYPES } from 'src/config-global';

export const MindMapEdge = memo((props) => {
  const {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEnd,
    style,
    selected,
  } = props;

  const {
    mindMap: { selected: selectedElements },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const currentSelectedEdge = useMemo(
    () =>
      selectedElements?.find(
        ({ element, type }) => type !== EDIT_MODES.PANE_EDITING && element.id === id
      ),
    [selectedElements]
  );

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: style?.stroke || DEFAULT_EDGE_COLOR,

        ...(selected && {
          stroke: `${currentSelectedEdge?.element?.style?.stroke || DEFAULT_EDGE_COLOR}`,
        }),
      }}
    />
  );
});
