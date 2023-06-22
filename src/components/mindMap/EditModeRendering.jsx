import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
import { EDIT_MODES } from 'src/config-global';
import { EdgeEditing } from './EdgeEditing';
import { NodeEditing } from './NodeEditing';
import { PaneEditing } from './PaneEditing';

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
