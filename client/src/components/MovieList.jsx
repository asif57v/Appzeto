import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get('/admin/movies').then(res => setMovies(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Movies Directory</h2>
      {movies.length === 0 ? <p>No movies added yet.</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Title</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Genre</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Language</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Duration</th>
              <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(m => (
              <tr key={m._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px 8px', fontWeight: '500' }}>{m.title}</td>
                <td style={{ padding: '16px 8px' }}><span className="badge">{m.genre}</span></td>
                <td style={{ padding: '16px 8px' }}>{m.language}</td>
                <td style={{ padding: '16px 8px' }}>{m.duration}m</td>
                <td style={{ padding: '16px 8px' }}>
                  <Link to={`/admin/edit-movie/${m._id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
