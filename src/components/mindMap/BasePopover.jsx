import { Button, Popover } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HEADER } from 'src/config-global';
import { setSelected } from 'src/redux/slices/mindMap';

export const BasePopover = (props) => {
  const {
    hasDispatch = false,
    children,
    id,
    close = false,
    variant = 'contained',
    size = 'large',
    color = 'primary',
    label = '',
    icon = null,
    anchorHorizontal = 'left',
    transformHorizontal = 'left',
    buttonStyles = {},
    popoverStyles = {},
  } = props;

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    hasDispatch && dispatch(setSelected(null));
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
        sx={{ fontSize: '1rem', fontWeight: 400, textTransform: 'unset', ...buttonStyles }}
      >
        {label}
      </Button>
      {open && (
        <Popover
          id={id}
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

            ...popoverStyles,
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
