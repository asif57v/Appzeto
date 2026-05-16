import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', duration: '', genre: '', releaseDate: '', cast: '', language: ''
  });
  
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      api.get(`/movies/${id}`).then(res => {
        const movie = res.data;
         


        
        const dateString = movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '';
        setFormData({
          title: movie.title,
          description: movie.description,
          duration: movie.duration,
          genre: movie.genre,
          releaseDate: dateString,
          cast: movie.cast.join(', '),
          language: movie.language
        });
      }).catch(console.error);
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        duration: parseInt(formData.duration),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c)
      };
      
      if (isEditing) {
        await api.put(`/admin/movies/${id}`, data);
        alert('Movie updated successfully');
        navigate('/admin/movies');
      } else {
        await api.post('/admin/movies', data);
        alert('Movie added successfully');
        setFormData({ title: '', description: '', duration: '', genre: '', releaseDate: '', cast: '', language: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || `Error ${isEditing ? 'updating' : 'adding'} movie`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '24px' }}>{isEditing ? 'Edit Movie' : 'Add New Movie'}</h2>
      
      <div className="form-group">
        <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Movie Title</label>
        <input className="form-control" placeholder="e.g. Avengers: Endgame" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
      </div>

      <div className="form-group">
        <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Description</label>
        <textarea className="form-control" rows="4" placeholder="Brief summary of the movie..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Duration (mins)</label>
          <input className="form-control" type="number" placeholder="120" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
        </div>
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Genre</label>
          <input className="form-control" placeholder="Action, Sci-Fi" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Release Date</label>
          <input className="form-control" type="date" value={formData.releaseDate} onChange={e => setFormData({...formData, releaseDate: e.target.value})} required />
        </div>
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Language</label>
          <input className="form-control" placeholder="English" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} required />
        </div>
      </div>

      <div className="form-group">
        <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Cast (Comma separated)</label>
        <input className="form-control" placeholder="Robert Downey Jr., Chris Evans" value={formData.cast} onChange={e => setFormData({...formData, cast: e.target.value})} required />
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
        {isEditing ? 'Update Movie' : 'Publish Movie'}
      </button>
    </form>
  );
}
