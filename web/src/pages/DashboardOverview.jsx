import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Shield,
  Layers,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getPipelineSummary, 
  getKpis, 
  getLegalQueuePreview, 
  getTodayActions, 
  getIntegrationsStatus 
} from '../services/dashboardService';

const StatCard = ({ icon: Icon, label, value, trend, trendLabel, glowColor, loading }) => (
  <div className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', minHeight: '140px' }}>
    {loading ? (
      <div className="skeleton-pulse" style={{ height: '100%', width: '100%', borderRadius: '12px' }}></div>
    ) : (
      <>
        <div style={{ 
          position: 'absolute', top: 0, right: 0, width: '6rem', height: '6rem', 
          background: glowColor || 'var(--accent)', opacity: 0.05, filter: 'blur(40px)' 
        }}></div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{label}</p>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>{value}</h3>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)' }}>
            <Icon style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
        </div>
        {trend && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
              <TrendingUp style={{ width: '0.75rem', height: '0.75rem' }} /> {trend}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{trendLabel || 'vs last month'}</span>
          </div>
        )}
      </>
    )}
  </div>
);

const PipelineStep = ({ label, count, blocker, active, onClick, loading }) => (
  <div 
    onClick={onClick}
    style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '0.5rem',
      cursor: 'pointer',
      opacity: active ? 1 : 0.6,
      transition: 'all 200ms ease'
    }}
  >
    {loading ? (
      <div className="skeleton-pulse" style={{ width: '100%', height: '40px', borderRadius: '4px' }}></div>
    ) : (
      <>
        <div style={{ 
          width: '100%', 
          height: '4px', 
          background: active ? 'var(--accent)' : 'var(--border)',
          borderRadius: '2px',
          position: 'relative'
        }}>
          {blocker && (
            <div style={{ 
              position: 'absolute', top: '-8px', right: '0', 
              width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444',
              boxShadow: '0 0 8px #EF4444'
            }} />
          )}
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: active ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
          {label}
        </span>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>
          {count}
        </span>
      </>
    )}
  </div>
);

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pipelineData, setPipelineData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [legalQueue, setLegalQueue] = useState([]);
  const [todayActions, setTodayActions] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pipelineRes, kpisRes, legalRes, actionsRes, integrationsRes] = await Promise.all([
        getPipelineSummary(),
        getKpis(),
        getLegalQueuePreview(),
        getTodayActions(),
        getIntegrationsStatus()
      ]);

      setPipelineData(pipelineRes.data);
      setKpis(kpisRes.data);
      setLegalQueue(legalRes.data);
      setTodayActions(actionsRes.data);
      setIntegrations(integrationsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <AlertCircle size={48} color="#EF4444" />
        <h2 style={{ color: 'var(--text-primary)' }}>{error}</h2>
        <button className="btn btn-primary" onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* 1. Hero / Overview Section */}
      <section style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', top: '-50px', left: '-50px', width: '300px', height: '300px',
          background: 'var(--accent)', opacity: 0.1, filter: 'blur(100px)', zIndex: 0
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="tag" style={{ marginBottom: '1.5rem' }}>Recruitment Operations Orchestrator</div>
          <h1 className="display-lg" style={{ marginBottom: '1rem' }}>
            Smarter Hiring, <br />
            <span className="serif-drama gradient-text">Seamless Management</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '2rem' }}>
            International recruitment focused on LATAM candidates, automated legal compliance, and centralized workforce management.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/candidates')}>
              Add New Candidate <ArrowRight size={16} />
            </button>
            <a 
              href="https://github.com/folga-pl/ori-cruit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-outline"
              style={{ textDecoration: 'none' }}
            >
              System Documentation
            </a>
          </div>
        </div>
      </section>

      {/* 2. Mini-Pipeline Widget */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Active Pipeline Stream</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LIVE UPDATES</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'space-between' }}>
          {[
            { key: 'LEADS', label: 'Leads' },
            { key: 'SURVEY', label: 'Survey' },
            { key: 'DOCUMENTS', label: 'Documents' },
            { key: 'LEGAL', label: 'Legal Review' },
            { key: 'PAYMENT', label: 'Payment' },
            { key: 'ASSIGNED', label: 'Assigned' },
            { key: 'FOLLOW_UP', label: 'Follow-up' }
          ].map((stage) => (
            <PipelineStep 
              key={stage.key}
              label={stage.label} 
              count={pipelineData?.[stage.key]?.count ?? 0} 
              blocker={pipelineData?.[stage.key]?.blocker}
              active 
              loading={loading}
              onClick={() => navigate(`/candidates?status=${stage.key}`)} 
            />
          ))}
        </div>
      </div>

      {/* 3. Key Metrics / KPIs Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          icon={Shield} 
          label="Avg. Legal Approval" 
          value={`${kpis?.avgLegalReviewDays ?? 0} Days`} 
          glowColor="var(--accent)"
          loading={loading}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Time-to-Assignment" 
          value={`${kpis?.avgTimeToAssignment ?? 0} Days`} 
          glowColor="var(--gold)"
          loading={loading}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Arrivals This Week" 
          value={kpis?.arrivalsThisWeek ?? 0} 
          glowColor="#22C55E"
          loading={loading}
        />
        <StatCard 
          icon={Clock} 
          label="Legal Blockers" 
          value={kpis?.legalBlockers ?? 0} 
          glowColor="#EF4444"
          loading={loading}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* 4. Work Queues - Legal Review Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Legal Review Queue</h3>
            <button className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => navigate('/candidates?status=LEGAL_REVIEW')}>View All</button>
          </div>
          
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton-pulse" style={{ height: '60px', borderRadius: '12px' }}></div>)
            ) : legalQueue.length > 0 ? (
              legalQueue.map((c, i) => (
                <div key={i} className="glass-card" style={{ 
                  padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                  cursor: 'pointer'
                }} onClick={() => navigate(`/candidates/${c.candidateId}?tab=legal`)}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.country}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>
                      Requested {new Date(c.requestedAt).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{c.status.replace('_', ' ')}</div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No pending reviews.
              </div>
            )}
          </div>
        </div>

        {/* 4. Work Queues - Today's Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Today's Actions</h3>
          </div>
          
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton-pulse" style={{ height: '50px', borderRadius: '4px' }}></div>)
            ) : todayActions.length > 0 ? (
              todayActions.map((a, i) => (
                <div key={i} style={{ 
                  padding: '0.75rem', display: 'flex', gap: '1rem', alignItems: 'center',
                  borderBottom: i < todayActions.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer'
                }} onClick={() => navigate(`/candidates/${a.candidateId}`)}>
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-dim)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                  }}>
                    {a.type.includes('INTERVIEW') && <Users size={14} />}
                    {a.type.includes('LEGAL') && <Shield size={14} />}
                    {a.type.includes('ARRIVAL') && <CheckCircle size={14} />}
                    {a.type.includes('FOLLOWUP') && <MessageSquare size={14} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {a.candidateName}
                    </div>
                  </div>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                No actions scheduled for today.
              </div>
            )}
          </div>
        </div>

        {/* 5. Integrations Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Active Integrations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="skeleton-pulse" style={{ height: '80px', borderRadius: '12px' }}></div>)
            ) : integrations.length > 0 ? (
              integrations.map((int, i) => (
                <div key={i} className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    {int.provider === 'WHATSAPP' ? '💬' : int.provider === 'HRAPPKA' ? '🏢' : '⚙️'}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{int.provider}</div>
                  <div style={{ fontSize: '0.6rem', color: int.enabled ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 800 }}>
                    {int.enabled ? 'ACTIVE' : 'DISABLED'}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 2', padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                No integrations configured.
              </div>
            )}
          </div>
          <button className="btn btn-outline" style={{ width: '100%', padding: '0.75rem' }} onClick={() => navigate('/settings')}>
            <Layers size={14} /> Manage All Integrations
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
