import { Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const WIDTH = 300;

export const InputField = (props) => {
  const {
    id,
    name,
    label = '',
    defaultValue = '',
    parentError = '',
    onChange,
    autoFocus = false,
    floatHelperText = false,
  } = props;

  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState(parentError);

  useEffect(() => {
    if (defaultValue.trim().length === 0) return;

    setError('');
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    setError(parentError);
  }, [parentError]);

  const handleChange = (event) => {
    setError('');

    const { value } = event.target;

    value.trim().length === 0 && setError('Tên nút không được để trống');

    setValue(value);
    onChange && onChange(value);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: WIDTH,
        ...(floatHelperText && {
          '& .MuiFormHelperText-root': {
            position: 'absolute',
            top: 'calc(100% + 12px)',
            width: '100%',

            p: 1,
            m: 0,

            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 0.5,
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',

            '&:before': {
              content: '""',

              display: 'block',
              position: 'absolute',
              top: 0,
              right: `calc((${WIDTH}px / 2) - (10px / 2))`,

              width: 10,
              height: 10,

              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }),
      }}
    >
      <TextField
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        onClick={(event) => event.stopPropagation()}
        label={label}
        variant="outlined"
        error={!!error}
        helperText={error}
        autoComplete="off"
        autoFocus={autoFocus}
        fullWidth
        size="small"
      />
    </Box>
  );
};
