// @mui
import { Box, Button, Stack, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// locales
import { useLocales } from '../../../locales';
// routes
import { PATH_DOCS } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function NavDocs() {
  const { user } = useAuthContext();

  const { translate } = useLocales();

  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        display: 'block',
        textAlign: 'center',
      }}
    >
      <Box component="img" src="/assets/illustrations/illustration_docs.svg" />
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          py: 1,
          px: 2,

          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 1,
        }}
      >
        <Typography variant="subtitle1">© 2022 GD VIỆT NAM</Typography>
        <Typography variant="button">Sơ đồ tư duy</Typography>
      </Stack>
    </Stack>
  );
}
