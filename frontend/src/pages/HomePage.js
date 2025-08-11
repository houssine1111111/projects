'use strict';

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useAuth } from '../state/AuthContext';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Bienvenue sur HRM
      </Typography>
      <Stack direction="row" spacing={2}>
        {!isAuthenticated ? (
          <Button variant="contained" component={RouterLink} to="/login">
            Se connecter
          </Button>
        ) : null}
        <Button variant="outlined" component={RouterLink} to="/employees">
          Employés
        </Button>
      </Stack>
    </Box>
  );
}