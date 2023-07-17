import { Box } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBeforeUnload } from 'react-router-dom';
import { HEADER, STORAGE_KEYS, TYPES } from 'src/config-global';
import { Header, Main } from 'src/sections/mindMap';
import { saveDataToLocalStorage } from 'src/utils/mindMap';

const PADDING = 4;

const MindMapPage = (props) => {
  const {
    mindMap: { nodes, bgcolor, edges },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  /** disable default right click event of browser  */
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextmenu);

    return () => document.removeEventListener('contextmenu', handleContextmenu);
  }, []);

  useBeforeUnload(
    useCallback(() => saveDataToLocalStorage({ nodes, bgcolor, edges }, STORAGE_KEYS.MIND_MAP)),
    [nodes, bgcolor, edges]
  );

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
