import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BaseToolbar } from 'src/components/mindMap';
import { EDIT_MODES, MULTI_SELECTION_RADIO, TYPES } from 'src/config-global';
import {
  setAllSelected,
  setAllSelectedNodesOrEdges,
  setElementContext,
  setSelected,
} from 'src/redux/slices/mindMap';

export const MultiSelectToolbar = (props) => {
  const dispatch = useDispatch();
  const {
    mindMap: { nodes, edges },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const [value, setValue] = useState(EDIT_MODES.CLEAR);

  const selectAllNodes = (selectedNodes) => {
    dispatch(setAllSelectedNodesOrEdges({ type: 'nodes', elements: selectedNodes }));
  };

  const selectAllEdges = (selectedEdges) => {
    dispatch(setAllSelectedNodesOrEdges({ type: 'edges', elements: selectedEdges }));
  };

  const selectAllNodesAndEdges = () => {
    dispatch(setAllSelected());
  };

  const clearSelected = () => {
    dispatch(setSelected(null));
    dispatch(setElementContext(null));
  };

  const onRadioClick = (event) => {
    dispatch(setElementContext(null));

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
        <RadioGroup aria-labelledby="multi-select-radio" value={value} name="multi-select-radio">
          {MULTI_SELECTION_RADIO.map(({ id, value, label, icon }) => (
            <FormControlLabel
              onChange={() => setValue(value)}
              onClick={onRadioClick}
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
