'use strict';

import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, Grid, MenuItem, TextField } from '@mui/material';
import DataTable from '../components/DataTable';
import api from '../utils/api';

export default function EmployeesListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const [filters, setFilters] = useState({ search: '', status: '', employmentType: '' });

  const columns = useMemo(() => [
    { id: 'firstName', label: 'Prénom', sortable: true },
    { id: 'lastName', label: 'Nom', sortable: true },
    { id: 'email', label: 'Email', sortable: true },
    { id: 'department', label: 'Département', sortable: true },
    { id: 'status', label: 'Statut', sortable: true },
  ], []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(limit),
        sort: order === 'asc' ? orderBy : `-${orderBy}`,
      });
      if (filters.search) params.set('search', filters.search);
      if (filters.status) params.set('status', filters.status);
      if (filters.employmentType) params.set('employmentType', filters.employmentType);

      const { data } = await api.get(`/employees?${params.toString()}`);
      setRows(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [page, limit, order, orderBy]);

  const handleRequestSort = (_e, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Recherche" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} onBlur={() => { setPage(0); fetchData(); }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Statut" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} onBlur={() => { setPage(0); fetchData(); }}>
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="active">Actif</MenuItem>
            <MenuItem value="inactive">Inactif</MenuItem>
            <MenuItem value="terminated">Terminé</MenuItem>
            <MenuItem value="on_leave">En congé</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField select fullWidth label="Type de contrat" value={filters.employmentType} onChange={(e) => setFilters({ ...filters, employmentType: e.target.value })} onBlur={() => { setPage(0); fetchData(); }}>
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="full_time">Temps plein</MenuItem>
            <MenuItem value="part_time">Temps partiel</MenuItem>
            <MenuItem value="contract">Contrat</MenuItem>
            <MenuItem value="intern">Stagiaire</MenuItem>
            <MenuItem value="temporary">Temporaire</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <DataTable
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        rowsPerPage={limit}
        orderBy={orderBy}
        order={order}
        onRequestSort={handleRequestSort}
        onPageChange={(newPage) => setPage(newPage)}
        onRowsPerPageChange={(n) => { setLimit(n); setPage(0); }}
      />
    </Box>
  );
}