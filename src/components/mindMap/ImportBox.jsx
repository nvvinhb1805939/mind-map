import { Box, Button, Input } from '@mui/material';
import { useDispatch } from 'react-redux';
import { renewMindMap, setSelected } from 'src/redux/slices/mindMap';
import { importTextFile } from 'src/utils/mindMap';
import { PublishOutlined as PublishOutlinedIcon } from '@mui/icons-material';
import { updateOpenId } from 'src/redux/slices/popper';
import { useSnackbar } from 'notistack';

export const ImportBox = (props) => {
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const onFileChange = (event) => {
    if (!event.target.files[0]) return;

    const reader = new FileReader();

    // this event is triggered after method readAsText is called
    reader.onload = async (event) => {
      try {
        const text = event.target.result;

        const mindMap = importTextFile(text);

        dispatch(renewMindMap(mindMap));
      } catch (error) {
        enqueueSnackbar('Tập tin không hợp lệ!', {
          variant: 'error',
        });
      }
    };

    reader.readAsText(event.target.files[0]); // read content of file

    event.target.value = null;
  };

  return (
    <Box>
      <Button
        onClick={() => {
          dispatch(updateOpenId(null));
          dispatch(setSelected(null));
        }}
        component="label"
        htmlFor="import"
        variant="outlined"
        size="large"
        startIcon={<PublishOutlinedIcon />}
        sx={{ fontWeight: 'unset', textTransform: 'unset' }}
      >
        Tải lên
      </Button>
      <Input
        id="import"
        name="import"
        type="file"
        inputProps={{ accept: 'text/plain' }}
        sx={{ display: 'none' }}
        onChange={onFileChange}
      />
    </Box>
  );
};
