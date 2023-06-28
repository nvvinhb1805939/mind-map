import { memo } from 'react';

export const NodeEditing = memo(({ selected }) => {
  console.log(selected[0].element);

  return <div>NodeEditing {selected[0].element.data.label}</div>;
});
