'use strict';

import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import api from '../utils/api';

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await api.get('/employees?limit=10&page=1');
        if (isMounted) setRows(data.data || []);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || 'Erreur de chargement');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Employés
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Prénom</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Département</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id || r.id}>
                <TableCell>{r.firstName}</TableCell>
                <TableCell>{r.lastName}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.department}</TableCell>
                <TableCell>{r.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}