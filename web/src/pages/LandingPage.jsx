import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Menu, X, ChevronRight, ArrowRight, Globe, Shield, Zap,
  Users, FileText, CheckCircle, Star, TrendingUp, Building2,
  MessageSquare, Calendar, Lock, BarChart3, Layers, Cpu, CreditCard
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── NAVBAR ─── */
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
      zIndex: 1000, width: 'calc(100% - 2.5rem)', maxWidth: '1200px',
      background: 'transparent', border: '1px solid transparent',
      borderRadius: '999px', padding: '0.65rem 1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 900, color: 'var(--obsidian)'
          }}>OC</div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>
            Ori‑Cruit
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md-flex">
          {links.map(l => (
            <a key={l.name} href={l.href} style={{
              color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500,
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
              padding: '0.4rem 0.85rem 0.4rem 1.85rem', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', outline: 'none'
            }}>
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="PL">PL</option>
            </select>
        </div>
        <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '0.5rem 1.35rem' }}>Login</button>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '0.5rem 1.35rem' }}>Sign Up</button>
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  const containerRef = useRef();
  const navigate = useNavigate();
  
  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from('.hero-anim', {
            y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: 'power3.out', delay: 0.2
        });
        gsap.from('.hero-mockup', {
            y: 80, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.6
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} style={{
      minHeight: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      paddingTop: '10rem', paddingBottom: '6rem'
    }}>
      {/* Background Blobs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 50% 0%, rgba(0, 212, 170, 0.15) 0%, transparent 60%)',
      }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="hero-anim tag" style={{ marginBottom: '2.5rem' }}>
          <Zap size={14} /> Recruitment Operations simplified
        </div>
        
        <h1 className="hero-anim display-xl" style={{ maxWidth: '1000px', margin: '0 auto 1.5rem' }}>
          Smarter Hiring, Seamless Management, <span className="serif-drama gradient-text">Happier Teams</span>
        </h1>
        
        <p className="hero-anim" style={{ 
          fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', 
          margin: '0 auto 3rem', lineHeight: 1.6 
        }}>
          All-in-one HR software to simplify hiring, onboarding, payroll, and performance — so you can build and manage a thriving international team with ease.
        </p>
        
        <div className="hero-anim" style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '5rem' }}>
          <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            Book a Demo <ArrowRight size={18} />
          </button>
          <button className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            View Workflow
          </button>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="hero-mockup glass-card" style={{ 
          maxWidth: '1000px', margin: '0 auto', padding: '1rem',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,212,170,0.3)',
          background: 'rgba(8, 12, 16, 0.8)', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            background: 'var(--obsidian-3)', borderRadius: '12px', overflow: 'hidden', 
            border: '1px solid var(--border)' 
          }}>
            <header style={{ 
              padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.02)'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ori-cruit.io/dashboard</div>
              <div style={{ width: 40 }} />
            </header>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', textAlign: 'left' }}>
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[Layers, Users, Shield, CreditCard, BarChart3].map((Icon, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem',
                    borderRadius: '8px', background: i === 0 ? 'var(--accent-dim)' : 'transparent',
                    color: i === 0 ? 'var(--accent)' : 'var(--text-secondary)'
                  }}>
                    <Icon size={18} />
                    <div style={{ width: '60%', height: '8px', background: 'currentColor', opacity: 0.2, borderRadius: '4px' }} />
                  </div>
                ))}
              </aside>
              <main>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                       <div style={{ width: '40%', height: '8px', background: 'var(--text-muted)', opacity: 0.3, marginBottom: '0.75rem' }} />
                       <div style={{ width: '70%', height: '16px', background: 'var(--text-primary)', opacity: 0.8 }} />
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '10px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ width: '30%', height: '12px', background: 'var(--text-primary)', opacity: 0.5 }} />
                      <div style={{ width: '15%', height: '12px', background: 'var(--accent)', opacity: 0.8 }} />
                   </div>
                   {[1, 2, 3, 4].map(i => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                       <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border)' }} />
                       <div style={{ flex: 1, height: '8px', background: 'var(--border)' }} />
                       <div style={{ width: '20%', height: '8px', background: 'var(--border)' }} />
                     </div>
                   ))}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SOLUTIONS ─── */
function Solutions() {
  const cards = [
    {
      title: 'Automated Onboarding',
      desc: 'Get new hires up to speed quickly with seamless onboarding and self-service training tools.',
      icon: Users,
    },
    {
      title: 'Global Compliance',
      desc: 'Centralized employee data management. Store, organize, and access all employee info securely.',
      icon: Shield,
    },
    {
      title: 'Payroll & Benefits',
      desc: 'Automate payroll processing, tax compliance, and benefits administration across borders.',
      icon: CreditCard,
    }
  ];

  return (
    <section id="solutions" className="section" style={{ background: 'var(--obsidian)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
           <div className="tag" style={{ marginBottom: '1.5rem' }}>Why Choose Us</div>
           <h2 className="display-md">Say Goodbye to <span className="serif-drama gradient-text">HR Headaches</span></h2>
           <p style={{ color: 'var(--text-secondary)', marginTop: '1.25rem', fontSize: '1.1rem', maxWidth: '600px', margin: '1.25rem auto 0' }}>
             Say goodbye to manual processes and scattered tools. Our all-in-one HR platform helps you streamline hiring, payroll, and employee management.
           </p>
        </div>
        
        <div className="grid-3">
          {cards.map((c, i) => (
            <div key={i} className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
               <div style={{ 
                 width: 64, height: 64, borderRadius: '20px', background: 'var(--accent-dim)',
                 display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)',
                 margin: '0 auto 2rem'
               }}>
                 <c.icon size={32} />
               </div>
               <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{c.title}</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── INTEGRATIONS ─── */
function Integrations() {
    const integrations = [
        { name: 'Google', icon: '📅' },
        { name: 'Slack', icon: '⚡' },
        { name: 'Notion', icon: '📝' },
        { name: 'Microsoft', icon: '☁️' },
        { name: 'HRappka', icon: '🏢' },
        { name: 'WhatsApp', icon: '💬' },
    ];

    return (
        <section id="integrations" className="section" style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 170, 0.05) 0%, var(--obsidian) 70%)' 
        }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <div className="tag" style={{ marginBottom: '1.5rem' }}>Powerful Ecosystem</div>
                <h2 className="display-md">Everything you need for<br /><span className="serif-drama gradient-text">International Scale</span></h2>
                
                <div style={{ 
                  display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap',
                  marginTop: '4rem', maxWidth: '800px', margin: '4rem auto 0'
                }}>
                    {integrations.map((int, i) => (
                        <div key={i} className="integration-icon" style={{ 
                          width: 80, height: 80, fontSize: '2rem',
                          background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)'
                         }}>
                            {int.icon}
                        </div>
                    ))}
                </div>
                
                <p style={{ marginTop: '3rem', color: 'var(--text-secondary)' }}>
                    Connect your favorite tools and automate your entire workflow.
                </p>
            </div>
        </section>
    );
}

/* ─── FOOTER ─── */
function Footer() {
    return (
        <footer style={{ background: 'var(--obsidian)', borderTop: '1px solid var(--border)', padding: '6rem 0 3rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Ori‑Cruit</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Smarter hiring for international teams.
                        </p>
                    </div>
                    {['Product', 'Company', 'Resources', 'Legal'].map(col => (
                        <div key={col}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{col}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[1, 2, 3].map(i => (
                                    <a key={i} href="#" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Link {i}</a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <span>© 2025 Ori‑Cruit. Global Recruitment Operations.</span>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--obsidian)', color: 'var(--text-primary)' }}>
      <Navbar />
      <Hero />
      <Solutions />
      <Integrations />
      <Footer />
    </div>
  );
}
