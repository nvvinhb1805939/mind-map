import {
  BaseToolbar,
  ClearToolbarButton,
  RedoToolbarButton,
  ResetToolbarButton,
  RestoreToolbarButton,
  SaveToolbarButton,
  UndoToolbarButton,
} from 'src/components/mindMap';
import { MultiSelectToolbarButton } from 'src/components/mindMap/MultiSelectToolbarButton';

export const FlowToolbar = (props) => {
  return (
    <BaseToolbar>
      <MultiSelectToolbarButton />
      <SaveToolbarButton />
      <RestoreToolbarButton />
      <UndoToolbarButton />
      <RedoToolbarButton />
      <ResetToolbarButton />
      <ClearToolbarButton />
    </BaseToolbar>
  );
};
