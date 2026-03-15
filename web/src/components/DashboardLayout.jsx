import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--obsidian)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="pulse-dot" style={{ width: '2rem', height: '2rem' }}></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--obsidian)' }}>
      <Sidebar />
      <main style={{ paddingLeft: '260px', minHeight: '100dvh' }}>
        <div style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
