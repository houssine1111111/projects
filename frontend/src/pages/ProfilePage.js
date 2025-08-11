'use strict';

import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import api from '../utils/api';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await api.get('/auth/profile');
        if (isMounted) setUser(data.user);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || 'Erreur de chargement');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return null;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Profil</Typography>
      <TextField label="Email" value={user.email} InputProps={{ readOnly: true }} />
      <TextField label="Prénom" value={user.firstName} InputProps={{ readOnly: true }} />
      <TextField label="Nom" value={user.lastName} InputProps={{ readOnly: true }} />
      <TextField label="Rôle" value={user.role} InputProps={{ readOnly: true }} />
    </Stack>
  );
}