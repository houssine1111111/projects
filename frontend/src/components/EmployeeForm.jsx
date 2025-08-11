'use strict';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';

const employmentTypes = [
  { value: 'full_time', label: 'Temps plein' },
  { value: 'part_time', label: 'Temps partiel' },
  { value: 'contract', label: 'Contrat' },
  { value: 'intern', label: 'Stagiaire' },
  { value: 'temporary', label: 'Temporaire' },
];

const statuses = [
  { value: 'active', label: 'Actif' },
  { value: 'inactive', label: 'Inactif' },
  { value: 'terminated', label: 'Terminé' },
  { value: 'on_leave', label: 'En congé' },
];

const validationSchema = Yup.object({
  firstName: Yup.string().min(2).max(50).required('Requis'),
  lastName: Yup.string().min(2).max(50).required('Requis'),
  email: Yup.string().email('Email invalide').required('Requis'),
  department: Yup.string().max(100).nullable(),
  position: Yup.string().max(100).nullable(),
  employmentType: Yup.string().oneOf(employmentTypes.map((e) => e.value)).required('Requis'),
  status: Yup.string().oneOf(statuses.map((s) => s.value)).required('Requis'),
});

export default function EmployeeForm({ initialValues, onSubmit, submitLabel = 'Enregistrer' }) {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      employmentType: 'full_time',
      status: 'active',
      ...initialValues,
    },
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const { values, errors, touched, handleChange, handleSubmit, isSubmitting } = formik;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="firstName" label="Prénom" value={values.firstName} onChange={handleChange} error={Boolean(touched.firstName && errors.firstName)} helperText={touched.firstName && errors.firstName} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="lastName" label="Nom" value={values.lastName} onChange={handleChange} error={Boolean(touched.lastName && errors.lastName)} helperText={touched.lastName && errors.lastName} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="email" label="Email" type="email" value={values.email} onChange={handleChange} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="department" label="Département" value={values.department} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth name="position" label="Poste" value={values.position} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select fullWidth name="employmentType" label="Type de contrat" value={values.employmentType} onChange={handleChange} error={Boolean(touched.employmentType && errors.employmentType)} helperText={touched.employmentType && errors.employmentType}>
            {employmentTypes.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField select fullWidth name="status" label="Statut" value={values.status} onChange={handleChange} error={Boolean(touched.status && errors.status)} helperText={touched.status && errors.status}>
            {statuses.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}