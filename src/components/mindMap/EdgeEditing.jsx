import { ImagesearchRollerOutlined as ImagesearchRollerOutlinedIcon } from '@mui/icons-material';
import { Button, Stack, Tooltip } from '@mui/material';
import { useSnackbar } from 'notistack';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_EDGE_COLOR, EDIT_MODES } from 'src/config-global';
import {
  changeEdgeColor,
  copyFormat,
  pasteEdgeFormat,
  setSelected,
} from 'src/redux/slices/mindMap';
import { ColorPicker, PasteFormat } from '.';

export const EdgeEditing = memo(({ selected, copied }) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const onChangeComplete = ({ hex }) => {
    dispatch(
      setSelected({
        element: { ...selected[0].element, style: { stroke: hex } },
        type: EDIT_MODES.EDGE_EDITING,
      })
    );
    dispatch(
      changeEdgeColor({
        id: selected[0].element.id,
        stroke: hex,
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

  const pasteFormat = () => {
    const { copy_type, ...copiedEdge } = copied;

    const pastedEdge = {
      ...selected[0].element,
      ...copiedEdge,
    };

    dispatch(pasteEdgeFormat(pastedEdge));
    dispatch(setSelected({ ...selected[0], element: pastedEdge }));
  };

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        onChangeComplete={onChangeComplete}
        initialColor={selected[0].element?.style?.stroke || DEFAULT_EDGE_COLOR}
        tooltip="Màu đường kẻ"
      />
      <Tooltip title="Sao chép định dạng" disableInteractive>
        <Button
          onClick={copyEdgeFormat}
          sx={{ minWidth: 'unset', width: '40px !important', height: '40px !important' }}
          variant="outlined"
          color="inherit"
        >
          <ImagesearchRollerOutlinedIcon />
        </Button>
      </Tooltip>
      {!!selected && <PasteFormat selected={selected} copied={copied} action={pasteFormat} />}
    </Stack>
  );
});
