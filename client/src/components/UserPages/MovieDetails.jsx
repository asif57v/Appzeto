import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    api.get(`/movies/${id}`).then(res => setMovie(res.data)).catch(console.error);
    api.get(`/shows/${id}`).then(res => setShows(res.data)).catch(console.error);
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '8px' }}>{movie.title}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge">{movie.genre}</span>
            <span className="badge">{movie.language}</span>
            <span className="badge">{movie.duration} mins</span>
          </div>
        </div>
      </div>

      <p style={{ color: '#fff', fontSize: '16px' }}>{movie.description}</p>
      
      <div style={{ margin: '24px 0', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Cast</h4>
        <p style={{ margin: 0, color: '#fff' }}>{movie.cast.join(', ')}</p>
      </div>

      <h3 style={{ marginTop: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Available Shows</h3>
      
      {shows.length === 0 ? <p>No shows currently scheduled.</p> : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
          {shows.map(show => (
            <div key={show._id} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', width: '200px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', margin: '0 0 16px 0' }}>{show.time}</h3>
              <p style={{ fontSize: '12px', margin: '0 0 16px 0' }}>{show.totalSeats} Total Seats</p>
              <Link to={`/show/${show._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                Select Seats
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
