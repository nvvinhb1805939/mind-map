import { DeleteOutlineOutlined as DeleteOutlineOutlinedIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { TYPES } from 'src/config-global';
import { BaseTooltipButton } from '.';
import { deleteBothNodesAndEdges } from 'src/utils/mindMap';

export const SelectionElementDeleting = ({ selected }) => {
  const {
    mindMap: { nodes, edges },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const onDeleteSelectedElements = () => {
    deleteBothNodesAndEdges(nodes, edges, selected);
  };

  return (
    <BaseTooltipButton
      title="Xóa nút và đường kẻ"
      action={onDeleteSelectedElements}
      icon={<DeleteOutlineOutlinedIcon />}
    />
  );
};
