const Movie = require('../models/Movie');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// Seat Pricing logic
const calculatePrice = (seatNumber) => {
  if (seatNumber >= 1 && seatNumber <= 10) return 150;
  if (seatNumber >= 11 && seatNumber <= 20) return 180;
  if (seatNumber >= 21 && seatNumber <= 30) return 200;
  return 0; // Invalid
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShowsByMovie = async (req, res) => {
  try {
    const shows = await Show.find({ movieId: req.params.movieId }).populate('movieId');
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movieId');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.status(200).json(show);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.lockSeats = async (req, res) => {
  try {
    const { showId, seats, userId } = req.body;
    
    if (!showId || !seats || !userId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'showId, seats array, and userId are required' });
    }

    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const conflictingSeats = [];
    const now = new Date();

    for (let seatNum of seats) {
      if (seatNum < 1 || seatNum > 30) {
        return res.status(400).json({ message: `Invalid seat number: ${seatNum}` });
      }

      const seat = show.seats.find(s => s.seatNumber === seatNum);
      
      if (seat.isBooked) {
        conflictingSeats.push(seatNum);
        continue;
      }
      
      if (seat.lockedBy && seat.lockedBy !== userId) {
        // Check if lock expired
        if (seat.lockExpiry && new Date(seat.lockExpiry) > now) {
           conflictingSeats.push(seatNum);
        }
      }
    }

    if (conflictingSeats.length > 0) {
      return res.status(409).json({ message: `Seats unavailable: ${conflictingSeats.join(', ')}` });
    }

    // Lock the seats for 2 minutes
    const lockExpiryTime = new Date(now.getTime() + 2 * 60000);
    
    for (let seatNum of seats) {
      const seat = show.seats.find(s => s.seatNumber === seatNum);
      seat.lockedBy = userId;
      seat.lockExpiry = lockExpiryTime;
    }

    await show.save();

    res.status(200).json({ message: 'Seats locked successfully', lockedUntil: lockExpiryTime });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSeats = async (req, res) => {
  try {
    const { showId, seats, userId } = req.body;
    
    if (!showId || !seats || !userId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'showId, seats array, and userId are required' });
    }

    const show = await Show.findById(showId);

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const now = new Date();
    let totalPrice = 0;

    for (let seatNum of seats) {
      if (seatNum < 1 || seatNum > 30) {
        return res.status(400).json({ message: `Invalid seat number: ${seatNum}` });
      }

      const seat = show.seats.find(s => s.seatNumber === seatNum);
      
      if (seat.isBooked) {
        return res.status(409).json({ message: `Seat ${seatNum} is already booked` });
      }

      // If seat is locked, it must be locked by this user and not expired
      if (seat.lockedBy && seat.lockedBy !== userId && seat.lockExpiry && new Date(seat.lockExpiry) > now) {
         return res.status(409).json({ message: `Seat ${seatNum} is locked by another user` });
      }

      // Lock expiration
      if (seat.lockedBy === userId && seat.lockExpiry && new Date(seat.lockExpiry) <= now) {
         return res.status(409).json({ message: `Lock expired for seat ${seatNum}. Please re-select.` });
      }

      if (seat.lockedBy !== userId || (seat.lockedBy === userId && new Date(seat.lockExpiry) <= now)) {
         return res.status(409).json({ message: `Lock expired or missing for seat ${seatNum}` });
      }

      totalPrice += calculatePrice(seatNum);
    }

    // Process booking
    for (let seatNum of seats) {
      const seat = show.seats.find(s => s.seatNumber === seatNum);
      seat.isBooked = true;
      seat.lockedBy = null;
      seat.lockExpiry = null;
    }

    await show.save();

    const booking = new Booking({
      showId,
      movieId: show.movieId,
      userId,
      seats,
      totalPrice
    });

    await booking.save();
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('movieId').populate('showId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
