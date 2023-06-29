import { Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DEFAULT_NODE_BG_COLOR, DEFAULT_NODE_BORDER_COLOR, EDIT_MODES } from 'src/config-global';
import { setSelected, updateNodeProps } from 'src/redux/slices/mindMap';
import { ColorPicker } from '.';
import { InputField } from './InputField';

export const NodeEditing = memo(({ selected }) => {
  const dispatch = useDispatch();

  const [nodeLabel, setNodeLabel] = useState(selected[0].element?.data?.label || '');

  const onNodePropsChangeComplete = (styleProps = {}, otherProps = {}) => {
    const data = {
      ...selected[0].element.data,
      ...otherProps,
      styles: {
        ...selected[0].element.data.styles,
        // ...(color && prop & { [prop]: color }),
        ...styleProps,
      },
    };

    dispatch(
      setSelected({
        element: {
          ...selected[0].element,
          data,
        },
        type: EDIT_MODES.NODE_EDITING,
      })
    );
    dispatch(
      updateNodeProps({
        id: selected[0].element.id,
        data,
      })
    );
  };

  useEffect(() => {
    if (nodeLabel.trim().length === 0) return;

    const delayTimer = setTimeout(() => {
      onNodePropsChangeComplete({}, { label: nodeLabel.trim() });
    }, 500);

    return () => clearTimeout(delayTimer);
  }, [nodeLabel]);

  return (
    <Stack direction="row" justifyContent="space-between" gap={1}>
      <ColorPicker
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ bgcolor: hex })}
        initialColor={selected[0].element?.data?.styles?.bgcolor || DEFAULT_NODE_BG_COLOR}
        tooltip="Màu nền"
      />
      <ColorPicker
        onChangeComplete={({ hex }) => onNodePropsChangeComplete({ borderColor: hex })}
        initialColor={selected[0].element?.data?.styles?.borderColor || DEFAULT_NODE_BORDER_COLOR}
        tooltip="Màu viền"
      />
      <InputField
        id={selected[0].element.id}
        name="label"
        defaultValue={selected[0].element?.data?.label || ''}
        onChange={setNodeLabel}
        floatHelperText={true}
      />
    </Stack>
  );
});
