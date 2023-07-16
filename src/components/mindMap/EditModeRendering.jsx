import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { EDIT_MODES, TYPES } from 'src/config-global';
import { getEditingMode } from 'src/utils/mindMap';
import { EdgeEditing } from './EdgeEditing';
import { NodeEditing } from './NodeEditing';
import { PaneEditing } from './PaneEditing';

export const EditModeRendering = (props) => {
  const {
    mindMap: { copied, selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const renderEditMode = (mode) => {
    switch (mode) {
      case EDIT_MODES.PANE_EDITING:
        return <PaneEditing />;
      case EDIT_MODES.NODE_EDITING:
        return <NodeEditing selected={selected} copied={copied} />;
      case EDIT_MODES.EDGE_EDITING:
        return <EdgeEditing selected={selected} copied={copied} />;
      default:
        break;
    }
  };

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center">
      {renderEditMode(getEditingMode(selected))}
    </Stack>
  );
};
