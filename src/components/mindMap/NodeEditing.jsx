import { memo } from 'react';

export const NodeEditing = memo(({ selected }) => {
  return <div>NodeEditing {selected[0].element.data.label}</div>;
});
