import { Button, Popover } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HEADER } from 'src/config-global';

export const BasePopover = (props) => {
  const {
    children,
    id,
    close = false,
    variant = 'contained',
    size = 'large',
    color = 'primary',
    label = 'Button',
    icon = null,
    anchorHorizontal = 'left',
    transformHorizontal = 'left',
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    close && handleClose();
  }, [close]);

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        color={color}
        startIcon={icon}
        sx={{ fontSize: '1rem', fontWeight: 400, textTransform: 'unset' }}
      >
        {label}
      </Button>
      {open && (
        <Popover
          id="download-context-menu"
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: anchorHorizontal,
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: transformHorizontal,
          }}
          sx={{
            '& .MuiPaper-root': {
              borderRadius: 0.5,
              top: `${HEADER.H_DEFAULT}px !important`,
            },
            '& .MuiPopover-paper': {
              boxShadow: 11,
            },
          }}
        >
          {children}
        </Popover>
      )}
    </>
  );
};

BasePopover.propTypes = {
  id: PropTypes.string.isRequired,
  close: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
};
