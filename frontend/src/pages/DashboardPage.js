'use strict';

import React, { useEffect, useState } from 'react';
import { Alert, CircularProgress, Grid } from '@mui/material';
import StatCard from '../components/StatCard';
import api from '../utils/api';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [allRes, activeRes, inactiveRes] = await Promise.all([
          api.get('/employees?limit=1&page=1'),
          api.get('/employees?status=active&limit=1&page=1'),
          api.get('/employees?status=inactive&limit=1&page=1'),
        ]);
        if (!isMounted) return;
        setStats({
          total: allRes.data?.meta?.total || 0,
          active: activeRes.data?.meta?.total || 0,
          inactive: inactiveRes.data?.meta?.total || 0,
        });
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}><StatCard title="Employés" value={stats.total} /></Grid>
      <Grid item xs={12} md={3}><StatCard title="Actifs" value={stats.active} /></Grid>
      <Grid item xs={12} md={3}><StatCard title="Inactifs" value={stats.inactive} /></Grid>
    </Grid>
  );
}