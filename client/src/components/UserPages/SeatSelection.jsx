import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

export default function SeatSelection({ userId }) {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShow = () => {
      api.get(`/show/${showId}`).then(res => setShow(res.data)).catch(console.error);
    };
    fetchShow();
    const interval = setInterval(fetchShow, 5000);
    return () => clearInterval(interval);
  }, [showId]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) ? prev.filter(s => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleProceed = async () => {
    setError(null);
    try {
      const response = await api.post('/seats/lock', { showId, seats: selectedSeats, userId });
      navigate(`/booking-summary/${showId}`, { 
        state: { seats: selectedSeats, lockedUntil: response.data.lockedUntil } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to lock seats');
      api.get(`/show/${showId}`).then(res => setShow(res.data));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach(s => {
      if (s >= 1 && s <= 10) total += 150;
      else if (s >= 11 && s <= 20) total += 180;
      else if (s >= 21 && s <= 30) total += 200;
    });
    return total;
  };

  if (!show) return <div>Loading seating arrangement...</div>;

  const now = new Date();

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Seat Selection</h2>
      <p style={{ marginBottom: '24px' }}>{show.movieId?.title} • {show.time}</p>
      
      {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', color: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '48px' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px 10px 0 0', textAlign: 'center', fontSize: '10px', lineHeight: '20px', letterSpacing: '2px', marginBottom: '32px' }}>SCREEN THIS WAY</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', marginBottom: '32px' }}>
            {show.seats.map(seat => {
              const isSelected = selectedSeats.includes(seat.seatNumber);
              const isLockedByOther = seat.lockedBy && seat.lockedBy !== userId && new Date(seat.lockExpiry) > now;
              const isBooked = seat.isBooked;
              
              let bgColor = 'rgba(255,255,255,0.05)';
              let borderColor = 'var(--border)';
              let color = '#fff';
              let disabled = false;

              if (isBooked) {
                 bgColor = 'rgba(239, 68, 68, 0.2)';
                 borderColor = 'var(--danger)';
                 color = 'var(--danger)';
                 disabled = true;
              } else if (isLockedByOther) {
                 bgColor = 'rgba(245, 158, 11, 0.2)';
                 borderColor = 'var(--warning)';
                 color = 'var(--warning)';
                 disabled = true;
              } else if (isSelected) {
                 bgColor = 'var(--primary)';
                 borderColor = 'var(--primary)';
              } else {
                 // hover effect handled via style below
              }

              return (
                <button
                  key={seat.seatNumber}
                  disabled={disabled}
                  onClick={() => toggleSeat(seat.seatNumber)}
                  style={{
                    aspectRatio: '1', width: '100%', borderRadius: '8px 8px 4px 4px',
                    backgroundColor: bgColor, border: `1px solid ${borderColor}`, color: color,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s', fontSize: '12px', fontWeight: 'bold'
                  }}
                  onMouseOver={(e) => { if(!disabled && !isSelected) { e.target.style.borderColor = 'var(--success)'; e.target.style.color = 'var(--success)'; } }}
                  onMouseOut={(e) => { if(!disabled && !isSelected) { e.target.style.borderColor = 'var(--border)'; e.target.style.color = '#fff'; } }}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', border: '1px solid var(--border)', borderRadius: '4px' }}></div> Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '4px' }}></div> Selected
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--danger)', borderRadius: '4px' }}></div> Booked
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid var(--warning)', borderRadius: '4px' }}></div> Locked
            </div>
          </div>
        </div>
        
        <div style={{ width: '250px', background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Summary</h3>
          <p>Seats Selected: <strong>{selectedSeats.length}</strong></p>
          {selectedSeats.length > 0 && (
             <p style={{ fontSize: '12px' }}>{selectedSeats.join(', ')}</p>
          )}
          <h2 style={{ margin: '24px 0', color: 'var(--success)' }}>₹{calculateTotal()}</h2>
          <button onClick={handleProceed} disabled={selectedSeats.length === 0} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
            Proceed to Book
          </button>
        </div>
      </div>
    </div>
  );
}
