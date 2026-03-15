import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  LogOut, 
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Candidates', path: '/candidates' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('') || 'U';

  return (
    <div style={{
      width: '260px', height: '100dvh', background: 'var(--obsidian-2)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '2rem 1.5rem', position: 'fixed', top: 0, left: 0, zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0, cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          ORI<span style={{ color: 'var(--accent)' }}>-</span>CRUIT
        </h1>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: '0.2rem 0 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Recruitment OS</p>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.7rem 1rem', borderRadius: '0.75rem',
              textDecoration: 'none', transition: 'all 180ms ease',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              border: isActive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
              fontWeight: isActive ? 700 : 500,
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute('aria-current')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            <item.icon style={{ width: '1.15rem', height: '1.15rem', flexShrink: 0 }} />
            <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Panel */}
      <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* User Info — clickable to settings */}
        <div
          onClick={() => navigate('/settings')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'background 150ms' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--obsidian)', fontWeight: 800, fontSize: '0.8rem'
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName || 'User'}</p>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width: '100%', padding: '0.6rem', color: 'var(--text-muted)', gap: '0.6rem', justifyContent: 'center' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut style={{ width: '1rem', height: '1rem' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
