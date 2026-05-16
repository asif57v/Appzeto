import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MovieForm from './MovieForm';
import ShowForm from './ShowForm';
import MovieList from './MovieList';

export default function AdminPanel() {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path) ? 'var(--primary)' : 'transparent';

  return (
    <div style={{ display: 'flex', gap: '32px' }}>
      <div className="glass-panel" style={{ width: '250px', height: 'fit-content' }}>
        <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>Admin Panel</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link to="/admin/movies" className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderLeft: `4px solid ${isActive('movies') || location.pathname.endsWith('/admin') ? 'var(--primary)' : 'transparent'}` }}>Manage Movies</Link>
          <Link to="/admin/add-movie" className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderLeft: `4px solid ${isActive('add-movie')}` }}>Add Movie</Link>
          <Link to="/admin/add-show" className="btn btn-secondary" style={{ justifyContent: 'flex-start', borderLeft: `4px solid ${isActive('add-show')}` }}>Add Show</Link>
        </nav>
      </div>
      
      <div className="glass-panel" style={{ flexGrow: 1 }}>
        <Routes>
          <Route index element={<MovieList />} />
          <Route path="movies" element={<MovieList />} />
          <Route path="add-movie" element={<MovieForm />} />
          <Route path="edit-movie/:id" element={<MovieForm />} />
          <Route path="add-show" element={<ShowForm />} />
        </Routes>
      </div>
    </div>
  );
}
