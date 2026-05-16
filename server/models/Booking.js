const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: String, required: true },
  seats: { 
    type: [Number], 
    required: true,
    validate: {
        validator: function(v) { return v && v.length > 0; },
        message: 'Seats array cannot be empty.'
    }
  },
  totalPrice: { type: Number, required: true },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
