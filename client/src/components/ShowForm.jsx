import { useState, useEffect } from 'react';
import api from '../api';

export default function ShowForm() {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ movieId: '', time: '', totalSeats: 30 });

  useEffect(() => {
    api.get('/admin/movies').then(res => setMovies(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/shows', formData);
      alert('Show added successfully');
      setFormData({ movieId: '', time: '', totalSeats: 30 });
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding show');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '24px' }}>Schedule a Show</h2>
      
      <div className="form-group">
        <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Select Movie</label>
        <select className="form-control" value={formData.movieId} onChange={e => setFormData({...formData, movieId: e.target.value})} required>
          <option value="">-- Choose a Movie --</option>
          {movies.map(m => <option key={m._id} value={m._id} style={{ background: 'var(--bg-dark)' }}>{m.title}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Time</label>
          <input className="form-control" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
        </div>
        
        <div className="form-group">
          <label style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Total Seats</label>
          <input className="form-control" type="number" value={formData.totalSeats} disabled />
          <small style={{ marginTop: '4px', color: 'var(--warning)', fontSize: '12px' }}>Seats are auto-generated based on requirements.</small>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
        Schedule Show
      </button>
    </form>
  );
}
