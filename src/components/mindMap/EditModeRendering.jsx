import { useSelector } from 'react-redux';
import { EDIT_MODES } from 'src/config-global';
import { PaneEditing } from './PaneEditing';
import { NodeEditing } from './NodeEditing';
import { EdgeEditing } from './EdgeEditing';
import { Stack } from '@mui/material';

export const EditModeRendering = (props) => {
  const { mode } = useSelector((state) => state.editMode);

  const renderEditMode = (mode) => {
    switch (mode) {
      case EDIT_MODES.PANE_EDITING:
        return <PaneEditing />;
      case EDIT_MODES.NODE_EDITING:
        return <NodeEditing />;
      case EDIT_MODES.EDGE_EDITING:
        return <EdgeEditing />;
      default:
        break;
    }
  };

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center">
      {renderEditMode(mode)}
    </Stack>
  );
};
