import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from './state/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/EmployeesPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesListPage from './pages/EmployeesListPage';
import EmployeeEditPage from './pages/EmployeeEditPage';
import ProfilePage from './pages/ProfilePage';
import ResponsiveNavbar from './components/ResponsiveNavbar';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const pages = [
    { label: 'Accueil', onClick: () => navigate('/') },
    { label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { label: 'Employés', onClick: () => navigate('/employees/list') },
  ];
  const userMenu = [
    { label: 'Profil', onClick: () => navigate('/profile') },
  ];
  return (
    <>
      <ResponsiveNavbar title="HRM" pages={pages} userMenu={userMenu} onLogout={isAuthenticated ? logout : undefined} />
      <Container sx={{ mt: 3 }}>
        {children}
      </Container>
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
        <Route path="/employees/list" element={<ProtectedRoute><EmployeesListPage /></ProtectedRoute>} />
        <Route path="/employees/:id/edit" element={<ProtectedRoute><EmployeeEditPage /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
