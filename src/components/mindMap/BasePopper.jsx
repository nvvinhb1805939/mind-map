import { Button, ClickAwayListener, Popper, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected } from 'src/redux/slices/mindMap';
import { updateOpenId } from 'src/redux/slices/popper';

export const BasePopper = (props) => {
  const {
    hasDispatch = false,
    children,
    id,
    tooltip = '',
    variant = 'contained',
    size = 'large',
    color = 'primary',
    label = '',
    icon = null,
    buttonStyles = {},
    popperStyles = {},
  } = props;

  const dispatch = useDispatch();
  const { openId } = useSelector((state) => state.popper);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = !!anchorEl && id === openId;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    dispatch(updateOpenId(id));
    hasDispatch && dispatch(setSelected(null));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={tooltip} disableInteractive>
        <Button
          onClick={handleClick}
          variant={variant}
          size={size}
          color={color}
          startIcon={icon}
          sx={{
            fontSize: '1rem',
            fontWeight: 400,
            textTransform: 'unset',
            ...(open && { pointerEvents: 'none' }),
            ...buttonStyles,
          }}
        >
          {label}
        </Button>
      </Tooltip>
      {open && (
        <ClickAwayListener onClickAway={handleClose}>
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement="bottom-start"
            sx={{
              top: '12px !important',
              zIndex: 1100,
              boxShadow: 11,
              borderRadius: 0.5,
              bgcolor: 'background.paper',

              ...popperStyles,
            }}
          >
            {children}
          </Popper>
        </ClickAwayListener>
      )}
    </>
  );
};

BasePopper.propTypes = {
  id: PropTypes.string.isRequired,
  close: PropTypes.bool,
  variant: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
};
