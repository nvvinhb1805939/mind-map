import {
  DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
  ImagesearchRollerOutlined as ImagesearchRollerOutlinedIcon,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_EDGE_COLOR, EDIT_MODES, TYPES } from 'src/config-global';
import {
  copyFormat,
  deleteEdges as deleteEdgesAction,
  updateElementProps,
} from 'src/redux/slices/mindMap';
import { getEditingMode, onDeleteElements } from 'src/utils/mindMap';
import { BaseTooltipButton, ColorPicker, PasteFormat } from '.';

export const EdgeEditing = memo(({ selected, copied }) => {
  const dispatch = useDispatch();
  const {
    mindMap: { edges, isMultiSelection },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const onChangeComplete = ({ hex }) => {
    dispatch(
      updateElementProps({
        type: 'edges',
        ids: selected.map(({ element }) => element.id),
        elementProps: () => ({
          style: {
            stroke: hex,
          },
        }),
      })
    );
  };

  const copyEdgeFormat = () => {
    dispatch(
      copyFormat({
        copy_type: EDIT_MODES.EDGE_EDITING,
        style: { stroke: DEFAULT_EDGE_COLOR, ...selected[0].element?.style },
      })
    );

    enqueueSnackbar('Sao chép định dạng thành công!');
  };

  const deleteEdges = () => {
    onDeleteElements(
      edges,
      selected.map(({ element }) => element),
      deleteEdgesAction
    );
  };

  const pasteFormat = () => {
    const { copy_type, ...copiedEdge } = copied;

    dispatch(
      updateElementProps({
        type: 'edges',
        ids: selected.map(({ element }) => element.id),
        elementProps: () => ({
          ...copiedEdge,
        }),
      })
    );
  };

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        id={`color-picker-edge-${selected[0].element.id}`}
        onChangeComplete={onChangeComplete}
        initialColor={selected[0].element?.style?.stroke || DEFAULT_EDGE_COLOR}
        tooltip="Màu đường kẻ"
      />

      {!isMultiSelection && (
        <BaseTooltipButton
          title="Sao chép định dạng"
          action={copyEdgeFormat}
          icon={<ImagesearchRollerOutlinedIcon />}
        />
      )}

      {/** if is multi select mode or not selected edge then not render */}
      {getEditingMode(selected) === EDIT_MODES.EDGE_EDITING && !!selected && (
        <PasteFormat selected={selected} copied={copied} action={pasteFormat} />
      )}

      {getEditingMode(selected) === EDIT_MODES.EDGE_EDITING && (
        <BaseTooltipButton
          title="Xóa đường kẻ"
          action={deleteEdges}
          icon={<DeleteOutlineOutlinedIcon />}
        />
      )}
    </Stack>
  );
});
