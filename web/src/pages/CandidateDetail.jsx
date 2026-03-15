import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Globe, FileText, 
  Clock, ShieldCheck, MessageSquare, Building,
  Upload, Download, Trash2, CheckCircle2, X,
  Loader2, AlertCircle, Edit2, Save, Plus
} from 'lucide-react';
import api from '../services/api';

const STATUS_COLORS = {
  LEAD: '#94a3b8', SURVEY_PENDING: '#EAB308', SURVEY_DONE: '#3B82F6',
  DOCS_PENDING: '#F97316', DOCS_SUBMITTED: '#a78bfa', LEGAL_REVIEW: '#8B5CF6',
  LEGAL_APPROVED: '#22C55E', LEGAL_REJECTED: '#EF4444',
  PAYMENT_PENDING: '#F59E0B', PAYMENT_DONE: '#10B981',
  ASSIGNED: '#00D4AA', ACTIVE: '#22C55E',
  CLOSED_SUCCESS: '#6B7280', CLOSED_NO_SHOW: '#EF4444', CLOSED_ABANDONED: '#9CA3AF'
};

const ALL_STATUSES = Object.keys(STATUS_COLORS);

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'documents') fetchDocuments();
    if (activeTab === 'messages') fetchMessages();
  }, [activeTab]);

  const fetchCandidate = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/candidates/${id}`);
      const c = res.data;
      setCandidate(c);
      setEditForm({
        firstName: c.firstName, lastName: c.lastName, email: c.email || '',
        phone: c.phone || '', whatsappNumber: c.whatsappNumber || '',
        nationality: c.nationality || '', countryOfOrigin: c.countryOfOrigin || '',
        source: c.source || '', notes: c.notes || ''
      });
      setDocuments(c.documents || []);
      setMessages(c.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/candidate-documents/candidate/${id}`);
      setDocuments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages?candidateId=${id}`);
      setMessages(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveEdit = async () => {
    setSavingEdit(true);
    try {
      await api.patch(`/candidates/${id}`, editForm);
      await fetchCandidate();
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await api.patch(`/candidates/${id}/status`, { status });
      setCandidate(prev => ({ ...prev, status }));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSendingMsg(true);
    try {
      await api.post('/messages/send', {
        candidateId: id,
        channel: 'EMAIL',
        customContent: newMessage,
        customSubject: `Message for ${candidate?.firstName}`
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleUploadDoc = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('candidateId', id);
    formData.append('type', 'OTHER');
    formData.append('fileName', file.name);
    try {
      await api.post('/candidate-documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!confirm('Delete this document?')) return;
    try {
      await api.delete(`/candidate-documents/${docId}`);
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  if (loading) return (
    <div style={{ padding: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={40} className="animate-spin" color="var(--accent)" />
    </div>
  );

  if (!candidate) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: '#EF4444' }}>
      <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
      <p>Candidate not found.</p>
    </div>
  );

  const fullName = `${candidate.firstName} ${candidate.lastName}`;
  const initials = `${candidate.firstName?.[0] || ''}${candidate.lastName?.[0] || ''}`.toUpperCase();
  const stageBg = STATUS_COLORS[candidate.status] || '#94a3b8';

  const tabs = ['overview', 'documents', 'compliance', 'messages'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button onClick={() => navigate('/candidates')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} /> Back to Candidates
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="btn btn-ghost" style={{ padding: '0.6rem 1rem' }}>
                <X size={15} /> Cancel
              </button>
              <button onClick={handleSaveEdit} disabled={savingEdit} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}>
                {savingEdit ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}>
                <Edit2 size={15} /> Edit
              </button>
              <button onClick={() => setActiveTab('messages')} className="btn btn-ghost" style={{ padding: '0.6rem 1.25rem', gap: '0.5rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <MessageSquare size={15} /> Message
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Left Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
            <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '20px', margin: '0 auto 1.25rem', background: 'linear-gradient(135deg, var(--accent), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: 'var(--obsidian)' }}>
              {initials}
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{fullName}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '999px', background: `${stageBg}20`, border: `1px solid ${stageBg}50`, color: stageBg, fontSize: '0.72rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {candidate.status?.replace(/_/g, ' ')}
            </div>

            {/* Quick Status Change */}
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.4rem' }}>Move Stage</label>
              <select
                value={candidate.status}
                onChange={e => handleStatusChange(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {ALL_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
              {candidate.email && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Mail size={14} color="var(--accent)" /> {candidate.email}</div>}
              {candidate.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Phone size={14} color="var(--accent)" /> {candidate.phone}</div>}
              {(candidate.nationality || candidate.countryOfOrigin) && <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}><Globe size={14} color="var(--accent)" /> {candidate.nationality || candidate.countryOfOrigin}</div>}
            </div>
          </div>

          {candidate.notes && !isEditing && (
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Notes</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{candidate.notes}</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tab Bar */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '0' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '0.85rem 1.25rem', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 150ms ease'
              }}>{tab}</button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {isEditing ? (
                <div className="glass-card" style={{ padding: '1.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Edit Candidate Info</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      ['First Name', 'firstName'], ['Last Name', 'lastName'],
                      ['Email', 'email', 'email'], ['Phone', 'phone', 'tel'],
                      ['WhatsApp', 'whatsappNumber', 'tel'], ['Nationality', 'nationality'],
                      ['Country of Origin', 'countryOfOrigin'], ['Source', 'source']
                    ].map(([label, key, type = 'text']) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{label}</label>
                        <input
                          type={type}
                          value={editForm[key] || ''}
                          onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>Notes</label>
                    <textarea
                      value={editForm.notes || ''}
                      onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                      rows={4}
                      style={{ width: '100%', padding: '0.6rem 0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.6rem', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  {/* Candidate events/timeline */}
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <Clock size={18} color="var(--gold)" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Recruitment Timeline</h3>
                    </div>
                    {(candidate.events || []).length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(candidate.events || []).map((ev, i) => (
                          <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: '0.35rem', flexShrink: 0 }}></div>
                              {i < (candidate.events || []).length - 1 && <div style={{ width: 1, flex: 1, background: 'var(--border)', margin: '0.25rem 0' }}></div>}
                            </div>
                            <div style={{ paddingBottom: '0.75rem' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ev.type.replace(/_/g, ' ')}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{new Date(ev.createdAt).toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No events recorded yet.</p>
                    )}
                  </div>

                  {/* Assignments */}
                  {(candidate.assignments || []).length > 0 && (
                    <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0,212,170,0.05), transparent)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Building size={18} color="var(--accent)" />
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Project Assignments</h3>
                      </div>
                      {candidate.assignments.map((a, i) => (
                        <div key={i} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.6rem', border: '1px solid var(--border)' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{a.project?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{a.project?.location}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* DOCUMENTS TAB */}
          {activeTab === 'documents' && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Document Vault</h3>
                </div>
                <label style={{ cursor: 'pointer' }}>
                  <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleUploadDoc} />
                  <div className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                    {uploadingDoc ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Upload Doc
                  </div>
                </label>
              </div>
              {documents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {documents.map(doc => (
                    <div key={doc.id} className="glass-card" style={{ padding: '1rem', border: '1px dashed var(--border)', position: 'relative' }}>
                      <FileText size={24} color="var(--text-secondary)" style={{ marginBottom: '0.75rem' }} />
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>{doc.fileName}</p>
                      <p style={{ margin: '0.2rem 0 0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{doc.type}</p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {doc.fileUrl && (
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Download size={12} /> View
                          </a>
                        )}
                        <button onClick={() => handleDeleteDoc(doc.id)} className="btn btn-ghost" style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Trash2 size={12} /> Del
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No documents yet. Upload one above.
                </div>
              )}
            </div>
          )}

          {/* COMPLIANCE TAB */}
          {activeTab === 'compliance' && (
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ShieldCheck size={18} color="var(--accent)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Legal Review History</h3>
              </div>
              {(candidate.legalReviews || []).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {candidate.legalReviews.map((lr, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: lr.status === 'APPROVED' ? '#22C55E' : lr.status === 'REJECTED' ? '#EF4444' : 'var(--gold)', fontSize: '0.85rem' }}>{lr.status}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{new Date(lr.createdAt).toLocaleDateString()}</span>
                      </div>
                      {lr.reason && <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>{lr.reason}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No legal reviews yet.</p>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <MessageSquare size={18} color="var(--accent)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Conversation</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', padding: '0.5rem 0' }}>
                {messages.length > 0 ? [...messages].reverse().map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: m.direction === 'OUTBOUND' ? 'row-reverse' : 'row', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div style={{ maxWidth: '70%', padding: '0.75rem 1rem', borderRadius: m.direction === 'OUTBOUND' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', background: m.direction === 'OUTBOUND' ? 'var(--accent)' : 'rgba(255,255,255,0.07)', color: m.direction === 'OUTBOUND' ? 'var(--obsidian)' : 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 500 }}>
                      <p style={{ margin: 0 }}>{m.body}</p>
                      <p style={{ margin: '0.3rem 0 0', fontSize: '0.68rem', opacity: 0.7, textAlign: m.direction === 'OUTBOUND' ? 'right' : 'left' }}>
                        {m.channel} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No messages yet. Start the conversation below.</p>
                )}
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={`Send a message to ${candidate.firstName}...`}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }}
                />
                <button type="submit" disabled={sendingMsg || !newMessage.trim()} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', gap: '0.5rem' }}>
                  {sendingMsg ? <Loader2 size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
