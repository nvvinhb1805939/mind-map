import { Box } from '@mui/material';
import { useEffect } from 'react';
import { HEADER } from 'src/config-global';
import { useSelector } from 'src/redux/store';
import { Header, Main } from 'src/sections/mindMap';

const PADDING = 4;

const MindMapPage = (props) => {
  const { isEdit } = useSelector((state) => state.mindMap);

  /** disable default right click event of browser  */
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextmenu);

    return () => document.removeEventListener('contextmenu', handleContextmenu);
  }, []);

  return (
    <>
      <Header isEdit={isEdit} />
      <Box
        sx={{
          height: '100vh',
          pt: `${HEADER.H_DEFAULT}px`,
          bgcolor: 'background.neutral',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: PADDING,
            height: '100%',

            '& .react-flow__attribution': {
              display: 'none',
            },
          }}
        >
          <Main />
        </Box>
      </Box>
    </>
  );
};

export default MindMapPage;
