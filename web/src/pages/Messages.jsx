import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ArrowRight, Send, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Messages = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/candidates?limit=100');
      setCandidates(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const selectCandidate = async (c) => {
    setSelectedCandidate(c);
    setLoadingMsgs(true);
    try {
      const res = await api.get(`/messages?candidateId=${c.id}`);
      setMessages([...(res.data || [])].reverse());
    } catch (err) { console.error(err); }
    finally { setLoadingMsgs(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedCandidate) return;
    setSending(true);
    try {
      const res = await api.post('/messages/send', {
        candidateId: selectedCandidate.id,
        channel: 'EMAIL',
        customContent: newMsg,
        customSubject: `Message for ${selectedCandidate.firstName}`
      });
      setMessages(m => [...m, res.data]);
      setNewMsg('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send.');
    } finally {
      setSending(false);
    }
  };

  const filtered = candidates.filter(c => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase());
  });

  const initials = (c) => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase();
  const fullName = (c) => `${c.firstName} ${c.lastName}`;

  const STATUS_COLORS = {
    PENDING: '#EAB308', SENT: '#3B82F6', DELIVERED: '#10B981', READ: '#22C55E', FAILED: '#EF4444'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>Messages</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Individual candidate conversations — Email and WhatsApp outreach.</p>
      </div>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', minHeight: '600px', overflow: 'hidden', padding: 0 }}>
        {/* Contact list */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '0.88rem' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 size={20} className="animate-spin" color="var(--accent)" /></div>
            ) : filtered.map(c => {
              const isSelected = selectedCandidate?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => selectCandidate(c)}
                  style={{
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem',
                    cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: isSelected ? 'var(--accent-dim)' : 'transparent',
                    transition: 'background 100ms'
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '12px', background: isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? 'var(--obsidian)' : 'var(--text-secondary)', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                    {initials(c)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? 'var(--accent)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName(c)}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email || c.phone || c.status}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Panel */}
        {selectedCandidate ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--obsidian)', fontWeight: 800, fontSize: '0.8rem' }}>
                  {initials(selectedCandidate)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{fullName(selectedCandidate)}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedCandidate.email || selectedCandidate.phone || '—'}</div>
                </div>
              </div>
              <button onClick={() => navigate(`/candidates/${selectedCandidate.id}`)} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                View Profile <ArrowRight size={14} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', minHeight: '0' }}>
              {loadingMsgs ? (
                <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}><Loader2 size={24} className="animate-spin" color="var(--accent)" /></div>
              ) : messages.length > 0 ? messages.map((m, i) => {
                const isOut = m.direction === 'OUTBOUND';
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: isOut ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '65%', padding: '0.8rem 1.1rem',
                      borderRadius: isOut ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                      background: isOut ? 'linear-gradient(135deg, var(--accent), #00b892)' : 'rgba(255,255,255,0.07)',
                      color: isOut ? 'var(--obsidian)' : 'var(--text-primary)',
                      fontSize: '0.88rem', lineHeight: 1.6, fontWeight: 500
                    }}>
                      <p style={{ margin: 0 }}>{m.body}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', justifyContent: isOut ? 'flex-end' : 'flex-start' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                          {m.channel} · {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isOut && m.status && (
                          <CheckCircle2 size={12} color={STATUS_COLORS[m.status] || '#6B7280'} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={40} opacity={0.3} />
                  <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>No messages yet.<br />Start the conversation below.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Compose */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                <textarea
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder={`Message ${selectedCandidate.firstName}...`}
                  rows={2}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                  style={{ flex: 1, padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontSize: '0.88rem', lineHeight: 1.5 }}
                />
                <button type="submit" disabled={sending || !newMsg.trim()} className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', flexShrink: 0 }}>
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </form>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Enter to send · Shift+Enter for new line</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-muted)', padding: '4rem' }}>
            <MessageSquare size={48} opacity={0.25} />
            <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>Select a candidate from the left<br />to view their conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
