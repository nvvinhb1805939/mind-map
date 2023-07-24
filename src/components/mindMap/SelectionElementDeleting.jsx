import React from 'react';
import { BaseTooltipButton } from '.';
import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@mui/icons-material';

export const SelectionElementDeleting = ({ selected }) => {
  const onDeleteSelectedElements = () => {
    console.log(selected);
  };

  return (
    <BaseTooltipButton
      title="Xóa nút và đường kẻ"
      action={onDeleteSelectedElements}
      icon={<DeleteOutlineOutlinedIcon />}
    />
  );
};
