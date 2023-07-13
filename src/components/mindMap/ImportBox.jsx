import { Box, Button, Input } from '@mui/material';
import { useDispatch } from 'react-redux';
import { renewMindMap } from 'src/redux/slices/mindMap';
import { importTextFile } from 'src/utils/mindMap';
import { PublishOutlined as PublishOutlinedIcon } from '@mui/icons-material';

export const ImportBox = (props) => {
  const dispatch = useDispatch();

  const onFileChange = (event) => {
    if (!event.target.files[0]) return;

    const reader = new FileReader();

    // this event is triggered after method readAsText is called
    reader.onload = async (event) => {
      const text = event.target.result;

      const mindMap = importTextFile(text);

      dispatch(renewMindMap(mindMap));
    };

    reader.readAsText(event.target.files[0]); // read content of file

    event.target.value = null;
  };

  return (
    <Box>
      <Button
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
