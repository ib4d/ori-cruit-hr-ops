import React, { useState } from 'react';
import { 
  User, Building, Layers, Save, 
  Globe, Mail, Lock, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'organization', icon: Building, label: 'Organization' },
    { id: 'integrations', icon: Layers, label: 'Integrations' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your preferences and organization configuration.</p>
      </div>

      <div style={{ display: 'flex', gap: '3rem' }}>
        {/* Sidebar Tabs */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                border: 'none', cursor: 'pointer', transition: 'all 200ms ease', textAlign: 'left',
                background: activeTab === tab.id ? 'var(--accent-dim)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              <tab.icon size={18} />
              <span style={{ fontWeight: 600 }}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1 }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            {activeTab === 'profile' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Personal Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name</label>
                    <input type="text" className="glass-card" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.02)' }} defaultValue={user?.fullName} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address</label>
                    <input type="email" readOnly className="glass-card" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', opacity: 0.6 }} defaultValue={user?.email} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Language Preference</label>
                    <select className="glass-card" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)' }} defaultValue={user?.languagePreference}>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="pl">Polski</option>
                    </select>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" style={{ gap: '0.75rem' }}>
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'organization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Organization Branding</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Customize how your workspace looks and feels for all team members.</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Primary Color</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input type="color" defaultValue="#00D4AA" style={{ width: '3rem', height: '3rem', border: 'none', background: 'none' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>#00D4AA</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Status</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Verified Organization
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Connected Services</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { name: 'HRappka', status: 'Connected', desc: 'Sync candidate data and legal statuses.' },
                    { name: 'WhatsApp Cloud API', status: 'Active', desc: 'Send automated outreach and follow-ups.' },
                    { name: 'Google Calendar', status: 'Pending', desc: 'Manage interviews and arrival schedules.' },
                  ].map((int, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{int.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{int.desc}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ 
                          fontSize: '0.75rem', fontWeight: 700, 
                          color: int.status === 'Connected' || int.status === 'Active' ? 'var(--accent)' : 'var(--gold)' 
                        }}>
                          {int.status.toUpperCase()}
                        </span>
                        <button className="btn btn-ghost" style={{ fontSize: '0.75rem' }}>Configure</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
