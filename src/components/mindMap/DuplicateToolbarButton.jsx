import { DifferenceOutlined as DifferenceOutlinedIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { EDIT_MODES, TYPES } from 'src/config-global';
import { addNode, pushStateToHistory } from 'src/redux/slices/mindMap';
import { v4 as uuidv4 } from 'uuid';
import { BaseToolbarButton } from './BaseToolbarButton';

export const DuplicateToolbarButton = () => {
  const dispatch = useDispatch();
  const {
    mindMap: { selected },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const onClick = (event) => {
    // add node
    dispatch(
      addNode({
        ...selected[0].element,
        id: uuidv4(),
        position: {
          x: selected[0].element.position.x + 10,
          y: selected[0].element.position.y + 10,
        },
      })
    );
    dispatch(pushStateToHistory()); // push to history
    enqueueSnackbar('Tạo bản sao thành công!');
  };

  return (
    <BaseToolbarButton
      title="Tạo bản sao"
      icon={<DifferenceOutlinedIcon />}
      disabled={selected?.[0]?.type !== EDIT_MODES.NODE_EDITING}
      callback={onClick}
    />
  );
};
