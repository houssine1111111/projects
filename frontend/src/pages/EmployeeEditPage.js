'use strict';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import EmployeeForm from '../components/EmployeeForm';
import api from '../utils/api';

export default function EmployeeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        if (isMounted) setData(data.employee);
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || 'Erreur de chargement');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <EmployeeForm
      initialValues={data}
      submitLabel="Enregistrer"
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await api.patch(`/employees/${id}`, values);
          navigate('/employees');
        } catch (err) {
          alert(err?.response?.data?.message || 'Erreur de sauvegarde');
        } finally {
          setSubmitting(false);
        }
      }}
    />
  );
}