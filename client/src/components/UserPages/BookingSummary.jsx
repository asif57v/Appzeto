import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

export default function BookingSummary({ userId }) {
  const { showId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { seats, lockedUntil } = location.state || { seats: [], lockedUntil: null };

  const [show, setShow] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!seats.length || !lockedUntil) {
      navigate('/');
      return;
    }

    api.get(`/show/${showId}`).then(res => setShow(res.data)).catch(console.error);

    const targetTime = new Date(lockedUntil).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setError('Lock expired. Please go back and re-select your seats.');
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showId, seats, lockedUntil, navigate]);

  const handleConfirm = async () => {
    try {
      await api.post('/book', { showId, seats, userId });
      navigate(`/bookings/${userId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  const calculateTotal = () => {
    let total = 0;
    seats.forEach(s => {
      if (s >= 1 && s <= 10) total += 150;
      else if (s >= 11 && s <= 20) total += 180;
      else if (s >= 21 && s <= 30) total += 200;
    });
    return total;
  };

  if (!show) return <div style={{ textAlign: 'center', marginTop: '40px' }}>Loading summary...</div>;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '40px auto' }}>
      <h2 style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '32px' }}>Booking Summary</h2>
      
      {error ? (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: '#fff', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
          <strong>{error}</strong>
        </div>
      ) : (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--warning)', padding: '16px', borderRadius: '8px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-main)' }}>Time remaining to complete:</span>
          <strong style={{ color: 'var(--warning)', fontSize: '24px', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</strong>
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '8px', color: 'var(--primary)' }}>{show.movieId?.title}</h3>
        <p style={{ margin: '0 0 8px 0', fontSize: '16px' }}><strong>Time:</strong> {show.time}</p>
        <p style={{ margin: 0, fontSize: '16px' }}><strong>Selected Seats:</strong> {seats.join(', ')}</p>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
        <h4 style={{ color: 'var(--text-muted)' }}>Price Breakdown:</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 32px 0' }}>
          {seats.map(seatNum => {
             let price = 0;
             let tier = '';
             if (seatNum >= 1 && seatNum <= 10) { price = 150; tier = 'Standard'; }
             else if (seatNum >= 11 && seatNum <= 20) { price = 180; tier = 'Premium'; }
             else { price = 200; tier = 'VIP'; }
             return (
               <li key={seatNum} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(255,255,255,0.1)' }}>
                 <span>Seat {seatNum} <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '8px' }}>({tier})</span></span>
                 <span>₹{price}</span>
               </li>
             );
          })}
        </ul>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ margin: 0 }}>Total Amount:</h3>
          <h2 style={{ margin: 0, color: 'var(--success)' }}>₹{calculateTotal()}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => navigate(`/show/${showId}`)} className="btn btn-secondary" style={{ flex: 1 }}>
          Cancel & Go Back
        </button>
        <button onClick={handleConfirm} disabled={!!error || timeLeft === 0} className="btn btn-primary" style={{ flex: 2, padding: '16px', fontSize: '16px' }}>
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
