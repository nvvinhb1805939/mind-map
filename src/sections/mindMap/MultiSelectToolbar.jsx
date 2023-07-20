import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseToolbar } from 'src/components/mindMap';
import { EDIT_MODES, MULTI_SELECTION_RADIO, TYPES } from 'src/config-global';
import { setMultiSelectedElements, setSelected, setSelectedAll } from 'src/redux/slices/mindMap';

export const MultiSelectToolbar = (props) => {
  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges, selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const [value, setValue] = useState(EDIT_MODES.CLEAR);

  useEffect(() => {
    !(
      selected?.[0]?.type === EDIT_MODES.NODE_EDITING ||
      selected?.[0]?.type === EDIT_MODES.EDGE_EDITING
    ) && setValue(EDIT_MODES.CLEAR);
  }, [selected]);

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
          value={value}
          name="multi-select-radio"
        >
          {MULTI_SELECTION_RADIO.map(({ id, value, label, icon }) => (
            <FormControlLabel
              onChange={() => setValue(value)}
              key={id}
              value={value}
              control={<Radio />}
              label={label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </BaseToolbar>
  );
};
