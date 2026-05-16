import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Home from './components/UserPages/Home';
import MovieDetails from './components/UserPages/MovieDetails';
import SeatSelection from './components/UserPages/SeatSelection';
import BookingSummary from './components/UserPages/BookingSummary';
import BookingHistory from './components/UserPages/BookingHistory';
import './App.css';

function App() {
  const userId = 'user_001'; // Mock user ID

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">BookMyShow Lite++</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Movies</Link>
          <Link to={`/bookings/${userId}`} className="nav-link">My Bookings</Link>
          <Link to="/admin" className="nav-link">Admin</Link>
        </div>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/show/:showId" element={<SeatSelection userId={userId} />} />
          <Route path="/booking-summary/:showId" element={<BookingSummary userId={userId} />} />
          <Route path="/bookings/:userId" element={<BookingHistory />} />
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
