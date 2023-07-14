import { Box } from '@mui/material';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HEADER, INITIAL_MIND_MAP, STORAGE_KEYS, TYPES } from 'src/config-global';
import { Header, Main } from 'src/sections/mindMap';
import { getDataFromLocalStorage } from 'src/utils/mindMap';

const PADDING = 4;

const MindMapPage = (props) => {
  // const { mindMap } = useSelector((state) => state[TYPES.MIND_MAP]);
  // const savedData = getDataFromLocalStorage(STORAGE_KEYS.MIND_MAP);

  /** disable default right click event of browser  */
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextmenu);

    return () => document.removeEventListener('contextmenu', handleContextmenu);
  }, []);

  // useEffect(() => {
  //   console.log(savedData, mindMap, isEqual(savedData, mindMap));

  //   const isNotChange = savedData
  //     ? isEqual(savedData, mindMap)
  //     : isEqual(INITIAL_MIND_MAP, mindMap);

  //   if (isNotChange) return;

  //   const onBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', onBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', onBeforeUnload);
  //   };
  // }, [mindMap, savedData]);

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
