import { ImagesearchRollerOutlined as ImagesearchRollerOutlinedIcon } from '@mui/icons-material';
import { Button, Stack, Tooltip } from '@mui/material';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_EDGE_COLOR, EDIT_MODES, MIND_MAP_CLASSES } from 'src/config-global';
import { changeEdgeColor, copyFormat, setSelected } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';

export const EdgeEditing = memo(({ selected }) => {
  const dispatch = useDispatch();

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
        copy_type: MIND_MAP_CLASSES.EDGE,
        style: { stroke: DEFAULT_EDGE_COLOR, ...selected[0].element?.style },
      })
    );
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
    </Stack>
  );
});
