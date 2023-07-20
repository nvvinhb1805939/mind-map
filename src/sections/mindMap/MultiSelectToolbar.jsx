import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { BaseToolbar } from 'src/components/mindMap';
import { EDIT_MODES, MULTI_SELECTION_RADIO, TYPES } from 'src/config-global';
import { setMultiSelectedElements, setSelected, setSelectedAll } from 'src/redux/slices/mindMap';

export const MultiSelectToolbar = (props) => {
  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const selectAllNodes = (nodes) => {
    const selectedNodes = nodes.map((node) => ({
      element: { ...node, selected: true },
      type: EDIT_MODES.NODE_EDITING,
    }));
    dispatch(setMultiSelectedElements({ type: 'nodes', elements: selectedNodes }));
  };

  const selectAllEdges = (edges) => {
    const selectedEdges = edges.map((edge) => ({
      element: { ...edge, selected: true },
      type: EDIT_MODES.EDGE_EDITING,
    }));
    dispatch(setMultiSelectedElements({ type: 'edges', elements: selectedEdges }));
  };

  const selectAllNodesAndEdges = () => {
    dispatch(setSelectedAll());
  };

  const clearSelected = () => {
    dispatch(setSelected(null));
  };

  const onChange = (event) => {
    const { value } = event.target;
    switch (value) {
      case EDIT_MODES.NODE_EDITING:
        selectAllNodes(nodes);
        break;
      case EDIT_MODES.EDGE_EDITING:
        selectAllEdges(edges);
        break;
      case EDIT_MODES.ALL:
        selectAllNodesAndEdges();
        break;

      default:
        clearSelected();
        break;
    }
  };

  return (
    <BaseToolbar position="top-right">
      <FormControl>
        <RadioGroup
          onChange={onChange}
          aria-labelledby="multi-select-radio"
          defaultValue={EDIT_MODES.CLEAR}
          name="multi-select-radio"
        >
          {MULTI_SELECTION_RADIO.map(({ id, value, label, icon }) => (
            <FormControlLabel key={id} value={value} control={<Radio />} label={label} />
          ))}
        </RadioGroup>
      </FormControl>
    </BaseToolbar>
  );
};
