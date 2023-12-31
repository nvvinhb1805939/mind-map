import {
  DownloadOutlined as DownloadOutlinedIcon,
  KeyboardArrowDownOutlined as KeyboardArrowDownOutlinedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  ClickAwayListener,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Slider,
  Typography,
} from '@mui/material';
import { toPng } from 'html-to-image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactFlow } from 'reactflow';
import {
  DOWNLOAD_CANVAS_SIZE,
  DOWNLOAD_CONTEXT_MENU,
  DOWNLOAD_CONTEXT_MENU_TYPES,
  TYPES,
} from 'src/config-global';
import { updateOpenId } from 'src/redux/slices/popper';
import { exportToTextFile, htmlToImage } from 'src/utils/mindMap';
import { BasePopper } from './BasePopper';
import { useSnackbar } from 'notistack';

const DEFAULT_SLIDER_VALUE = 50;

export const DownloadContextMenu = (props) => {
  const dispatch = useDispatch();
  const {
    mindMap,
    mindMap: { bgcolor },
  } = useSelector((state) => state[TYPES.MIND_MAP]);

  const { enqueueSnackbar } = useSnackbar();

  const [type, setType] = useState(DOWNLOAD_CONTEXT_MENU[0]);
  const [downloadTypeAnchorEl, setDownloadTypeAnchorEl] = useState(null);
  const [size, setSize] = useState(DOWNLOAD_CANVAS_SIZE);
  const [sliderValue, setSliderValue] = useState(DEFAULT_SLIDER_VALUE);

  const { getNodes } = useReactFlow();

  const handleTypeClick = (type) => {
    setType(type);
    setDownloadTypeAnchorEl(null);
  };

  const handleOpenDownloadType = (event) => {
    setDownloadTypeAnchorEl(event.target);
  };

  const handleCloseDownloadType = () => {
    setDownloadTypeAnchorEl(null);
  };

  const onSizeSliderChange = (event, newValue) => {
    setSliderValue(newValue);

    /** By default, DEFAULT_SLIDER_VALUE is equivalent to DOWNLOAD_CANVAS_SIZE */
    setSize({
      WIDTH: 2 * Math.round((DOWNLOAD_CANVAS_SIZE.WIDTH * newValue) / DEFAULT_SLIDER_VALUE / 2), // round to nearest even number
      HEIGHT: 2 * Math.round((DOWNLOAD_CANVAS_SIZE.HEIGHT * newValue) / DEFAULT_SLIDER_VALUE / 2), // round to nearest even number
    });
  };

  const handleDownloadClick = () => {
    try {
      type.id === DOWNLOAD_CONTEXT_MENU_TYPES.PNG
        ? htmlToImage(getNodes(), toPng, type.id, size, bgcolor) // download with type is image
        : exportToTextFile(mindMap); // download with type is text

      dispatch(updateOpenId(null)); // close popper
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra. Vui lòng tải lại trang!', { variant: 'error' });
    }
  };

  return (
    <BasePopper
      id="download-context-menu"
      hasDispatch={true}
      label="Tải xuống"
      variant="outlined"
      icon={<DownloadOutlinedIcon />}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ width: 300, mb: 2 }}>
          <Typography variant="body2">Loại tệp</Typography>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={type.icon}
            endIcon={<KeyboardArrowDownOutlinedIcon />}
            fullWidth
            sx={{
              mt: 1,
              justifyContent: 'flex-start',
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'unset',

              '& .MuiButton-endIcon': {
                ml: 'auto',
              },
            }}
            onClick={handleOpenDownloadType}
          >
            {type.title}
          </Button>
          {!!downloadTypeAnchorEl && (
            <Popper
              anchorEl={downloadTypeAnchorEl}
              open={!!downloadTypeAnchorEl}
              placement="bottom-start"
              sx={{
                top: '8px !important',
                zIndex: 'tooltip',
              }}
            >
              <ClickAwayListener onClickAway={handleCloseDownloadType}>
                <List
                  sx={{
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 11,
                  }}
                >
                  {DOWNLOAD_CONTEXT_MENU.map((item) => (
                    <ListItem key={item.id} disablePadding>
                      <ListItemButton onClick={() => handleTypeClick(item)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} secondary={item.caption} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </ClickAwayListener>
            </Popper>
          )}
        </Box>
        {type.id === DOWNLOAD_CONTEXT_MENU_TYPES.PNG && (
          <Box sx={{ width: 300, mb: 2 }}>
            <Typography variant="body2">Kích cỡ</Typography>
            <Slider
              name="sizeSlider"
              onChange={onSizeSliderChange}
              min={20}
              max={100}
              disabled={type.id !== DOWNLOAD_CONTEXT_MENU_TYPES.PNG}
              size="small"
              value={sliderValue}
              aria-label="Small"
            />

            <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
              {size.WIDTH}px &times; {size.HEIGHT}px
            </Typography>
          </Box>
        )}
        <Button variant="contained" fullWidth onClick={handleDownloadClick}>
          Tải xuống
        </Button>
      </Box>
    </BasePopper>
  );
};
