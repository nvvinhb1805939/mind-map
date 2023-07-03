import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HEADER, STORAGE_KEYS, TYPES } from 'src/config-global';
import { Header, Main } from 'src/sections/mindMap';
import { saveDataToLocalStorage } from 'src/utils/mindMap';

const PADDING = 4;

const MindMapPage = (props) => {
  const { mindMap } = useSelector((state) => state[TYPES.MIND_MAP]);

  /** disable default right click event of browser  */
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextmenu);

    return () => document.removeEventListener('contextmenu', handleContextmenu);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [mindMap]);

  return (
    <>
      <Header />
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
          }}
        >
          <Main />
        </Box>
      </Box>
    </>
  );
};

export default MindMapPage;
