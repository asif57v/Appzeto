import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

export default function BookingHistory() {
  const { userId } = useParams();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get(`/bookings/${userId}`).then(res => setBookings(res.data)).catch(console.error);
  }, [userId]);

  return (
    <div>
      <h2 style={{ marginBottom: '32px' }}>Booking History</h2>
      {bookings.length === 0 ? <p className="glass-panel" style={{ textAlign: 'center' }}>No bookings found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {bookings.map(b => (
            <div key={b._id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{b.movieId?.title}</h3>
                <p style={{ margin: '0 0 4px 0' }}>Show Time: <strong>{b.showId?.time}</strong></p>
                <p style={{ margin: '0 0 4px 0' }}>Seats: <strong>{b.seats.join(', ')}</strong></p>
                <p style={{ margin: 0, fontSize: '12px' }}>Booked At: {new Date(b.bookedAt).toLocaleString()}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 8px 0' }}>Total Paid</p>
                <h2 style={{ margin: 0, color: 'var(--success)' }}>₹{b.totalPrice}</h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
