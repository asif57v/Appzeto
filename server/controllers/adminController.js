const Movie = require('../models/Movie');
const Show = require('../models/Show');

exports.createMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, releaseDate, cast, language } = req.body;
    
    if (!title || !description || !duration || !genre || !releaseDate || !cast || !language) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }
    
    if (!Array.isArray(cast) || cast.length === 0) {
      return res.status(400).json({ message: 'Cast must be a non-empty array' });
    }
    
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive integer' });
    }

    const movie = new Movie({ title, description, duration, genre, releaseDate, cast, language });
    await movie.save();
    
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createShow = async (req, res) => {
  try {
    const { movieId, time, totalSeats } = req.body;
    
    if (!movieId || !time || !totalSeats) {
      return res.status(400).json({ message: 'movieId, time, and totalSeats are mandatory' });
    }
    
    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const show = new Show({ movieId, time, totalSeats });
    await show.save();
    
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movieId');
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, releaseDate, cast, language } = req.body;
    
    if (!title || !description || !duration || !genre || !releaseDate || !cast || !language) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }
    
    if (!Array.isArray(cast) || cast.length === 0) {
      return res.status(400).json({ message: 'Cast must be a non-empty array' });
    }
    
    if (typeof duration !== 'number' || duration <= 0) {
      return res.status(400).json({ message: 'Duration must be a positive integer' });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, description, duration, genre, releaseDate, cast, language },
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
