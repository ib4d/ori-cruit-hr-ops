import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Loader2, Globe, ChevronRight } from 'lucide-react';
import { getTemplates, sendMessage } from '../services/messageService';

const WhatsAppModal = ({ isOpen, onClose, candidate }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [customBody, setCustomBody] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Mocking templates based on backend Phase 4
      const mockTemplates = [
        { id: 1, code: 'WELCOME_LATAM', body: 'Hola {{name}}, bienvenidos a Ori-Cruit! Estamos revisando tus documentos.', locale: 'ES', channel: 'WHATSAPP' },
        { id: 2, code: 'DOCS_MISSING', body: 'Hello {{name}}, some documents are still missing for your application.', locale: 'EN', channel: 'WHATSAPP' },
        { id: 3, code: 'ARRIVAL_INSTRUCTIONS', body: 'Dzień dobry {{name}}, oto instrukcje przyjazdu do Polski.', locale: 'PL', channel: 'WHATSAPP' },
      ];
      setTemplates(mockTemplates);
      // const response = await getTemplates();
      // setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!selectedTemplate && !customBody) return;
    setSending(true);
    try {
      await sendMessage({
        candidateId: candidate.id,
        templateCode: selectedTemplate?.code,
        body: customBody || selectedTemplate?.body.replace('{{name}}', candidate.fullName),
        channel: 'WHATSAPP'
      });
      alert('Message sent successfully!');
      onClose();
    } catch (error) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', padding: '1rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '8px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>WhatsApp Portal</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sending to {candidate.fullName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Choose a Template</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {loading ? <div className="pulse-dot"></div> : templates.map(t => (
                <button 
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t);
                    setCustomBody(t.body.replace('{{name}}', candidate.fullName));
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem',
                    background: selectedTemplate?.id === t.id ? 'var(--accent-dim)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid', borderColor: selectedTemplate?.id === t.id ? 'var(--accent)' : 'var(--border)',
                    borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'left', transition: 'all 200ms ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.code}</span>
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--obsidian-3)', color: 'var(--text-muted)' }}>{t.locale}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} color={selectedTemplate?.id === t.id ? 'var(--accent)' : 'var(--muted)'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Message Preview</label>
            <textarea 
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              style={{
                width: '100%', minHeight: '120px', padding: '1rem', background: 'var(--obsidian-3)',
                border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--text-primary)',
                fontSize: '0.9rem', lineHeight: 1.5, outline: 'none', resize: 'none'
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem' }}>Cancel</button>
          <button 
            disabled={sending || (!selectedTemplate && !customBody)}
            onClick={handleSend}
            className="btn btn-primary" 
            style={{ padding: '0.6rem 1.5rem', background: '#25D366', color: 'white', border: 'none', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)' }}
          >
            {sending ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Send size={18} />
                <span>Send Message</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
