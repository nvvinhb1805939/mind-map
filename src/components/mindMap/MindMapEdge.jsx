import { memo } from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';
import { DEFAULT_EDGE_COLOR } from 'src/config-global';

export const MindMapEdge = memo((props) => {
  const {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    style = {},
    markerEnd,
  } = props;

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
      style={{ stroke: style?.stroke || DEFAULT_EDGE_COLOR }}
    />
  );
});
