import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Download, Trash2, Upload, Loader2, ArrowRight, FolderOpen } from 'lucide-react';
import api from '../services/api';

const DOC_TYPE_COLORS = {
  PASSPORT: '#3B82F6', KARTA_POBYTU: '#8B5CF6', VOIVODE_DECISION: '#F59E0B',
  WORK_PERMIT: '#10B981', CONTRACT: '#00D4AA', PHOTO_ID: '#F97316',
  PROOF_OF_ADDRESS: '#EC4899', OTHER: '#6B7280'
};

const Documents = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [docsByCandidate, setDocsByCandidate] = useState({});
  const [loadingDocs, setLoadingDocs] = useState({});

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates?limit=100');
      setCandidates(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadDocs = async (cId) => {
    if (docsByCandidate[cId]) return;
    setLoadingDocs(l => ({ ...l, [cId]: true }));
    try {
      const res = await api.get(`/candidate-documents/candidate/${cId}`);
      setDocsByCandidate(d => ({ ...d, [cId]: res.data }));
    } catch (err) { console.error(err); }
    finally { setLoadingDocs(l => ({ ...l, [cId]: false })); }
  };

  const toggle = (cId) => {
    if (expandedId === cId) { setExpandedId(null); return; }
    setExpandedId(cId);
    loadDocs(cId);
  };

  const handleUpload = async (cId, file) => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    form.append('candidateId', cId);
    form.append('type', 'OTHER');
    form.append('fileName', file.name);
    try {
      await api.post('/candidate-documents/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDocsByCandidate(d => ({ ...d, [cId]: undefined }));
      loadDocs(cId);
    } catch (err) { alert('Upload failed.'); }
  };

  const handleDelete = async (cId, docId) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/candidate-documents/${docId}`);
      setDocsByCandidate(d => ({ ...d, [cId]: d[cId].filter(doc => doc.id !== docId) }));
    } catch (err) { alert('Delete failed.'); }
  };

  const filtered = candidates.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || c.email?.includes(search.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>Document Vault</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Upload, manage, and verify candidate documents from one place.</p>
      </div>

      <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Search size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search candidates by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }}
        />
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}><Loader2 size={40} className="animate-spin" color="var(--accent)" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(c => {
            const isOpen = expandedId === c.id;
            const docs = docsByCandidate[c.id] || [];
            const isLoading = loadingDocs[c.id];
            const name = `${c.firstName} ${c.lastName}`;
            const initials = `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase();

            return (
              <div key={c.id} className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Row header */}
                <div
                  onClick={() => toggle(c.id)}
                  style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '2.2rem', height: '2.2rem', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-dim), rgba(201,168,76,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 800, fontSize: '0.78rem', flexShrink: 0 }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.email || c.phone || '—'} · {c.status?.replace(/_/g, ' ')}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                      <FolderOpen size={12} style={{ marginRight: '0.3rem' }} />
                      {isOpen ? (docs.length) : '···'} docs
                    </span>
                    <button onClick={e => { e.stopPropagation(); navigate(`/candidates/${c.id}`); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Expanded Documents */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documents</span>
                      <label style={{ cursor: 'pointer' }}>
                        <input type="file" style={{ display: 'none' }} onChange={e => handleUpload(c.id, e.target.files?.[0])} />
                        <div className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                          <Upload size={13} /> Upload
                        </div>
                      </label>
                    </div>

                    {isLoading ? (
                      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}><Loader2 size={20} className="animate-spin" color="var(--accent)" /></div>
                    ) : docs.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {docs.map(doc => (
                          <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.6rem', border: '1px solid var(--border)' }}>
                            <div style={{ width: '2rem', height: '2rem', borderRadius: '8px', background: `${DOC_TYPE_COLORS[doc.type] || '#6B7280'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileText size={14} color={DOC_TYPE_COLORS[doc.type] || '#6B7280'} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.fileName}</div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{doc.type} · {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              {doc.fileUrl && (
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem', display: 'flex', alignItems: 'center' }}>
                                  <Download size={14} />
                                </a>
                              )}
                              <button onClick={() => handleDelete(c.id, doc.id)} className="btn btn-ghost" style={{ padding: '0.3rem', color: '#EF4444', display: 'flex', alignItems: 'center' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No documents yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>No candidates found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Documents;
