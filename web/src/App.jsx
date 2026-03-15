import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import Projects from './pages/Projects';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardOverview /></DashboardLayout>} />
          <Route path="/candidates" element={<DashboardLayout><Candidates /></DashboardLayout>} />
          <Route path="/candidates/:id" element={<DashboardLayout><CandidateDetail /></DashboardLayout>} />
          <Route path="/projects" element={<DashboardLayout><Projects /></DashboardLayout>} />
          <Route path="/documents" element={<DashboardLayout><Documents /></DashboardLayout>} />
          <Route path="/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
