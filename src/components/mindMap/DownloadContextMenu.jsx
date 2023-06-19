import { DownloadOutlined as DownloadOutlinedIcon } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { toJpeg, toPng } from 'html-to-image';
import { useEffect, useState } from 'react';
import { useReactFlow } from 'reactflow';
import { DOWNLOAD_CONTEXT_MENU, DOWNLOAD_CONTEXT_MENU_TYPES } from 'src/config-global';
import { htmlToImage } from 'src/utils/mindMap';
import { BasePopover } from './BasePopover';

export const DownloadContextMenu = (props) => {
  const [close, setClose] = useState(false);

  const { getNodes } = useReactFlow();

  useEffect(() => {
    return () => setClose(false);
  });

  const handleClick = (type) => {
    switch (type) {
      case DOWNLOAD_CONTEXT_MENU_TYPES.JPG:
        htmlToImage(getNodes(), toJpeg, type);
        break;
      default:
        htmlToImage(getNodes(), toPng, type);
        break;
    }

    setClose(true);
  };

  return (
    <BasePopover
      id="download-context-menu"
      close={close}
      label="Tải xuống"
      variant="outlined"
      icon={<DownloadOutlinedIcon />}
      anchorHorizontal="right"
      transformHorizontal="right"
    >
      <Box>
        <Typography variant="body2" sx={{ p: 2 }}>
          Loại tệp
        </Typography>
        <List>
          {DOWNLOAD_CONTEXT_MENU.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={() => handleClick(item.id)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} secondary={item.caption} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </BasePopover>
  );
};
