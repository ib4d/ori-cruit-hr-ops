import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Plus, ArrowRight, MoreHorizontal,
  Mail, MapPin, CheckCircle2, AlertCircle, Clock, X, Loader2, UserPlus, ChevronDown
} from 'lucide-react';
import api from '../services/api';

const STATUS_CONFIGS = {
  LEAD:           { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: 'Lead' },
  SURVEY_PENDING: { color: '#EAB308', bg: 'rgba(234,179,8,0.1)',   label: 'Survey Pending' },
  SURVEY_DONE:    { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  label: 'Survey Done' },
  DOCS_PENDING:   { color: '#F97316', bg: 'rgba(249,115,22,0.1)',  label: 'Docs Pending' },
  DOCS_SUBMITTED: { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)',label: 'Docs Submitted' },
  LEGAL_REVIEW:   { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'Legal Review' },
  LEGAL_APPROVED: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',  label: 'Legal Approved' },
  LEGAL_REJECTED: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  label: 'Legal Rejected' },
  PAYMENT_PENDING:{ color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Payment Pending' },
  PAYMENT_DONE:   { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Payment Done' },
  ASSIGNED:       { color: '#00D4AA', bg: 'rgba(0,212,170,0.1)',  label: 'Assigned' },
  ACTIVE:         { color: '#22C55E', bg: 'rgba(34,197,94,0.1)',  label: 'Active' },
  CLOSED_SUCCESS: { color: '#6B7280', bg: 'rgba(107,114,128,0.1)',label: 'Closed - Success' },
  CLOSED_NO_SHOW: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Closed - No Show' },
  CLOSED_ABANDONED:{color: '#9CA3AF', bg: 'rgba(156,163,175,0.1)',label: 'Abandoned' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIGS[status] || STATUS_CONFIGS['LEAD'];
  return (
    <span style={{ 
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}30`
    }}>
      {cfg.label}
    </span>
  );
};

const AddCandidateModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    whatsappNumber: '', nationality: '', countryOfOrigin: '', source: 'Manual', notes: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/candidates', form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create candidate.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', required = false) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
        {label}{required && <span style={{ color: 'var(--accent)' }}> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        style={{
          width: '100%', padding: '0.65rem 0.9rem',
          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
          borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem'
        }}
      />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={22} />
        </button>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>New Candidate</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>Add a new candidate to the recruitment pipeline.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('First Name', 'firstName', 'text', true)}
            {field('Last Name', 'lastName', 'text', true)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('Email', 'email', 'email')}
            {field('Phone', 'phone', 'tel')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('WhatsApp Number', 'whatsappNumber', 'tel')}
            {field('Nationality', 'nationality')}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {field('Country of Origin', 'countryOfOrigin')}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Source</label>
              <select
                value={form.source}
                onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none' }}
              >
                {['Manual', 'WhatsApp', 'Referral', 'Job Board', 'HRappka Import'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Internal Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
            />
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>{error}</p>}
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', gap: '0.75rem' }}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {saving ? 'Adding...' : 'Add Candidate'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Candidates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const searchTimeout = useRef(null);

  const LIMIT = 25;

  useEffect(() => {
    fetchCandidates();
  }, [page, statusFilter]);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchCandidates();
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search]);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/candidates?${params}`);
      setCandidates(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initials = (c) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase();
  const fullName = (c) => `${c.firstName} ${c.lastName}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {showModal && <AddCandidateModal onClose={() => setShowModal(false)} onCreated={fetchCandidates} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>
            Candidate Pipeline
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            {total} candidates tracked · All stages visible
          </p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', gap: '0.75rem' }} onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add New Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', width: '1rem' }} />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          style={{ padding: '0.7rem 1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}
        >
          <option value="">All Stages</option>
          {Object.entries(STATUS_CONFIGS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {(search || statusFilter) && (
          <button className="btn btn-ghost" onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} style={{ fontSize: '0.8rem' }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Candidate</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Origin</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stage</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Source</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Added</th>
              <th style={{ padding: '1rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {[1,2,3,4,5,6].map(j => (
                    <td key={j} style={{ padding: '1.25rem 1.5rem' }}>
                      <div className="skeleton-pulse" style={{ height: '16px', borderRadius: '4px' }}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : candidates.length > 0 ? candidates.map(c => (
              <tr key={c.id}
                style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background 150ms' }}
                onClick={() => navigate(`/candidates/${c.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1.1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-dim), rgba(201,168,76,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      {initials(c)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{fullName(c)}</p>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{c.email || c.phone || '—'}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={13} color="var(--accent)" />
                    {c.nationality || c.countryOfOrigin || '—'}
                  </div>
                </td>
                <td style={{ padding: '1.1rem 1.5rem' }}>
                  <StatusBadge status={c.status} />
                </td>
                <td style={{ padding: '1.1rem 1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {c.source || 'Manual'}
                  </span>
                </td>
                <td style={{ padding: '1.1rem 1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </td>
                <td style={{ padding: '1.1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/candidates/${c.id}`); }}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No candidates found.{' '}
                  <button onClick={() => setShowModal(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 700 }}>
                    Add the first one
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>Page {page} of {totalPages} · {total} total</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>← Prev</button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
