import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, ArrowRight, X,
  MapPin, Loader2, AlertCircle
} from 'lucide-react';
import { getProjects, createProject } from '../services/projectService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    industry: '', // mapped to description or handled via tags if needed, but for now using description
    location: '',
    description: '',
    status: 'ACTIVE'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Could not load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject(formData);
      setIsModalOpen(false);
      setFormData({ name: '', industry: '', location: '', description: '', status: 'ACTIVE' });
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>Client Projects</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage workforce assignments across all client organizations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary" 
          style={{ padding: '0.75rem 1.5rem', gap: '0.75rem' }}
        >
          <Plus size={18} /> New Client Project
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        </div>
      ) : error ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#EF4444' }}>
          <AlertCircle size={40} style={{ marginBottom: '1rem' }} />
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {projects.length > 0 ? projects.map((project) => (
            <div key={project.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '12px', background: 'var(--obsidian-3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <Building2 size={24} />
                </div>
                <span className="tag" style={{ 
                  fontSize: '0.65rem', 
                  color: project.status === 'URGENT' ? '#F87171' : 'var(--accent)',
                  background: project.status === 'URGENT' ? 'rgba(248, 113, 113, 0.1)' : 'var(--accent-dim)'
                }}>
                  {project.status}
                </span>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>{project.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} /> {project.location || 'No location set'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>Workers</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{project._count?.assignments || 0}</div>
                </div>
                <div style={{ width: '1px', background: 'var(--border)' }}></div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.25rem' }}>Industry</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{project.description || 'Generic'}</div>
                </div>
              </div>

              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                Manage Assignment <ArrowRight size={16} />
              </button>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No projects found. Create your first one!
            </div>
          )}
        </div>
      )}

      {/* Modal for New Project */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>New Client Project</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Project Name</label>
                <input 
                  required
                  type="text" 
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', outline: 'none' }}
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Location</label>
                <input 
                  type="text" 
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', outline: 'none' }}
                  placeholder="e.g. Warsaw, Poland"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Industry / Description</label>
                <input 
                  type="text" 
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', outline: 'none' }}
                  placeholder="e.g. Logistics"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Status</label>
                <select 
                  className="glass-card"
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', outline: 'none', color: 'var(--text-primary)' }}
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="URGENT">URGENT</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
