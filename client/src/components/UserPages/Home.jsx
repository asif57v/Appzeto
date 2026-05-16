import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get('/movies').then(res => setMovies(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Now Showing</h2>
      </div>
      
      {movies.length === 0 ? (
        <p>No movies available right now.</p>
      ) : (
        <div className="grid-cards">
          {movies.map(m => (
            <div key={m._id} className="glass-panel movie-card">
              <h3 style={{ marginBottom: '8px' }}>{m.title}</h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <span className="badge">{m.genre}</span>
                <span className="badge">{m.language}</span>
              </div>
              <p style={{ flexGrow: 1, fontSize: '14px' }}>
                {m.description.substring(0, 100)}{m.description.length > 100 ? '...' : ''}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{m.duration} mins</span>
                <Link to={`/movie/${m._id}`} className="btn btn-primary">
                  Book Tickets
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
