const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  time: { type: String, required: true },
  totalSeats: { type: Number, required: true, default: 30 },
  seats: [{
    seatNumber: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    lockedBy: { type: String, default: null },
    lockExpiry: { type: Date, default: null }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate seats pre-save if new
showSchema.pre('save', function(next) {
  if (this.isNew && (!this.seats || this.seats.length === 0)) {
    const generatedSeats = [];
    for (let i = 1; i <= this.totalSeats; i++) {
      generatedSeats.push({
        seatNumber: i,
        isBooked: false,
        lockedBy: null,
        lockExpiry: null
      });
    }
    this.seats = generatedSeats;
  }
  next();
});

module.exports = mongoose.model('Show', showSchema);
