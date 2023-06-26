import { Box, Button, Input } from '@mui/material';
import { useDispatch } from 'react-redux';
import { restoreMindMap } from 'src/redux/slices/mindMap';
import { importTextFile } from 'src/utils/mindMap';

export const ImportBox = (props) => {
  const dispatch = useDispatch();

  const onFileChange = (event) => {
    const reader = new FileReader();

    // this event is triggered after method readAsText is called
    reader.onload = async (event) => {
      const text = event.target.result;
      // const { nodes, edges } = importTextFile(text);

      // dispatch(renewNodes(nodes));
      // dispatch(renewEdges(edges));

      const mindMap = importTextFile(text);

      dispatch(restoreMindMap(mindMap));
    };

    reader.readAsText(event.target.files[0]); // read content of file
  };

  return (
    <Box>
      <Button component="label" htmlFor="import" variant="contained">
        Import
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
