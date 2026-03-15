import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronRight, ArrowRight, Globe, Shield, Zap,
  Users, FileText, CheckCircle, Star, TrendingUp, Building2,
  MessageSquare, Calendar, Lock, BarChart3, Layers, Cpu,
  Search, SlidersHorizontal, UserCheck, CreditCard, Clock,
  Plus, MoreVertical
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── COMPONENTS ─── */

function Navbar() {
  const [lang, setLang] = useState('EN');
  const navRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Pipeline', href: '#pipeline' },
    { name: 'Compliance', href: '#compliance' },
    { name: 'Integrations', href: '#integrations' }
  ];

  return (
    <nav ref={navRef} id="navbar" style={{
      position: 'fixed', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, width: 'calc(100% - 2rem)', maxWidth: '1200px',
      background: 'transparent', border: '1px solid transparent',
      borderRadius: '999px', padding: '0.6rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.9rem', fontWeight: 900, color: 'var(--obsidian)'
          }}>OC</div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
            Ori‑Cruit
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="hidden md-flex">
          {links.map(l => (
            <a key={l.name} href={l.href} style={{
              color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500,
              textDecoration: 'none', transition: 'color 300ms ease',
            }} onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
               onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
              {l.name}
            </a>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Globe size={14} style={{ position: 'absolute', left: '0.6rem', color: 'var(--text-muted)' }} />
            <select value={lang} onChange={e => setLang(e.target.value)} style={{
              appearance: 'none', background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', borderRadius: '999px',
              padding: '0.35rem 0.75rem 0.35rem 1.75rem', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', outline: 'none'
            }}>
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="PL">PL</option>
            </select>
        </div>
        <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '0.5rem 1.25rem' }}>Login</button>
        <button className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Sign Up</button>
      </div>
    </nav>
  );
}

function Hero() {
  const containerRef = useRef();
  
  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from('.hero-anim', {
            y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out'
        });
        
        gsap.to('.hero-glow', {
            opacity: 0.6, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} style={{
      minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8rem 1.5rem 4rem',
    }}>
      <div className="hero-glow" style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vh', background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)',
        opacity: 0.3, pointerEvents: 'none', filter: 'blur(80px)', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="tag hero-anim" style={{ marginBottom: '2rem' }}>
          <Zap size={12} fill="currentColor" /> Recruitment Operations Orchestrator
        </div>

        <h1 className="hero-anim" style={{ marginBottom: '1.5rem' }}>
          <div className="display-xl" style={{ color: 'var(--text-primary)' }}>Smarter Hiring.</div>
          <div className="display-xl serif-drama gradient-text">Seamless Ops.</div>
        </h1>

        <p className="hero-anim" style={{
          fontSize: '1.25rem', color: 'var(--text-secondary)',
          maxWidth: '640px', margin: '0 auto', lineHeight: 1.6,
        }}>
          The all‑in‑one HR platform to automate candidate pipelines, legal compliance, 
          and international workforce management. Designed for agencies scaling from LATAM to EU.
        </p>

        <div className="hero-anim" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
          <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.25rem' }}>
            Book a Demo
          </button>
          <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '1rem 2.25rem' }}>
            View Workflow <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* DASHBOARD PREVIEW ARTIFACT */}
      <div className="hero-anim" style={{ 
        marginTop: '6rem', position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px',
        padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '2.5rem',
        border: '1px solid var(--border)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
      }}>
        <div style={{ 
            background: 'var(--obsidian-2)', borderRadius: '1.75rem', overflow: 'hidden',
            aspectRatio: '16/9', display: 'flex', flexDirection: 'column'
        }}>
           {/* Mock UI Toolbar */}
           <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                 {[1,2,3].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border)' }} />)}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                 <div style={{ width: 120, height: 8, borderRadius: 4, background: 'var(--border)' }} />
                 <Search size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
           </div>
           
           <div style={{ flex: 1, display: 'flex' }}>
              <div style={{ width: 60, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem' }}>
                 {[Grid2, Users, FileText, MessageSquare, BarChart3].map((Icon, i) => <Icon key={i} size={18} style={{ color: i === 1 ? 'var(--accent)' : 'var(--text-muted)' }} />)}
              </div>
              <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidatos Globales</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pipeline Directo</div>
                    </div>
                    <SlidersHorizontal size={14} style={{ color: 'var(--text-muted)' }} />
                 </div>
                 
                 <div className="grid-3" style={{ gap: '1rem' }}>
                    {['In Review', 'Verified', 'Assigned'].map((t, i) => (
                        <div key={t} className="glass-card" style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t}</span>
                                <TrendingUp size={10} style={{ color: i === 1 ? 'var(--accent)' : 'var(--text-muted)' }} />
                            </div>
                            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{i === 0 ? '124' : i === 1 ? '86' : '32'}</div>
                        </div>
                    ))}
                 </div>

                 <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid var(--border)', padding: '0.75rem' }}>
                    {[
                        { name: 'Alex Hernandez', origin: 'Mexico', status: 'Legal Review', color: 'var(--gold)' },
                        { name: 'Sofia Rodriguez', origin: 'Colombia', status: 'Verified', color: 'var(--accent)' },
                        { name: 'Mateo Lopez', origin: 'Peru', status: 'Payment Pending', color: '#E63B2E' }
                    ].map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--border)', marginRight: '0.75rem' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{c.name}</div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{c.origin}</div>
                            </div>
                            <div style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: `${c.color}20`, color: c.color, fontWeight: 700 }}>
                                {c.status}
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}

function FeatureArtifact({ icon: Icon, title, description, color }) {
    return (
        <div className="glass-card" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
                width: 54, height: 54, borderRadius: '14px', background: `${color}15`, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
                border: `1px solid ${color}30`, color: color
            }}>
                <Icon size={24} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{description}</p>
            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <a href="#" style={{ color: color, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Explorar Módulo <ChevronRight size={14} />
                </a>
            </div>
        </div>
    );
}

function Solutions() {
    return (
        <section id="solutions" className="section">
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div className="tag" style={{ marginBottom: '1.5rem' }}>Global Capabilities</div>
                    <h2 className="display-md" style={{ maxWidth: '700px', margin: '0 auto' }}>Everything you need for international scale.</h2>
                </div>

                <div className="grid-3">
                    <FeatureArtifact 
                        icon={Users} 
                        title="Pipeline de Candidatos" 
                        description="Visualiza el flujo completo desde el primer contacto hasta la llegada a destino Europa." 
                        color="var(--accent)"
                    />
                    <FeatureArtifact 
                        icon={Shield} 
                        title="Cumplimiento Legal" 
                        description="Validación automatizada de documentos y estados de visado GDPR/RODO." 
                        color="var(--gold)"
                    />
                    <FeatureArtifact 
                        icon={CreditCard} 
                        title="Gestión de Pagos" 
                        description="Control de tasas de legalización y comprobantes de pago centralizados." 
                        color="#7B61FF"
                    />
                </div>
            </div>
        </section>
    );
}

function Integrations() {
    const tools = [
        { name: 'HRappka', color: '#00A8E8' },
        { name: 'WhatsApp', color: '#25D366' },
        { name: 'Google', color: '#EA4335' },
        { name: 'Slack', color: '#4A154B' },
        { name: 'Airtable', color: '#18BFFF' },
        { name: 'Zapier', color: '#FF4A00' }
    ];

    return (
        <section id="integrations" className="section" style={{ background: 'linear-gradient(180deg, var(--obsidian) 0%, #0A0F14 100%)' }}>
            <div className="container">
                <div className="grid-2" style={{ alignItems: 'center' }}>
                    <div>
                        <div className="tag" style={{ marginBottom: '1.5rem' }}>Ecosystem</div>
                        <h2 className="display-md" style={{ marginBottom: '1.5rem' }}>Plugs into your existing stack.</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '480px', marginBottom: '2.5rem' }}>
                            Ori‑Cruit connects with HRappka for candidate sync and WhatsApp for automated communications.
                        </p>
                        <button className="btn btn-outline">Explore Marketplace</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                        {tools.map(t => (
                            <div key={t.name} className="integration-icon" style={{ height: 120 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.color + '20' }} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Grid2() { return <Layers size={18} /> } // Helper for icon mapping

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--obsidian)' }}>
      <Navbar />
      <main>
        <Hero />
        <div className="divider" />
        <Solutions />
        <Integrations />
      </main>
      
      <footer style={{ padding: '6rem 0 3rem', background: 'var(--obsidian-3)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
           <div className="grid-4" style={{ marginBottom: '4rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 30, height: 30, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--obsidian)', fontSize: '0.8rem' }}>OC</div>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>Ori‑Cruit</span>
                 </div>
                 <p style={{ color: 'var(--text-secondary)', maxWidth: '280px', fontSize: '0.9rem' }}>
                    Professional International Recruitment & HR Operations OS.
                 </p>
              </div>
              <div>
                 <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Product</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {['Solutions', 'Features', 'Pricing', 'API Docs'].map(l => <a key={l} href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>{l}</a>)}
                 </div>
              </div>
              <div>
                 <h4 style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Company</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {['About', 'Contact', 'Privacy', 'Legal'].map(l => <a key={l} href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>{l}</a>)}
                 </div>
              </div>
           </div>
           
           <div style={{ paddingTop: '2.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>© 2026 Ori‑Cruit. Global HR Solutions.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                 <div className="pulse-dot" style={{ background: 'var(--accent)' }} /> System Operational
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

