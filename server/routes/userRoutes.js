const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/movies', userController.getMovies);
router.get('/movies/:id', userController.getMovieById);
router.get('/shows/:movieId', userController.getShowsByMovie);
router.get('/show/:id', userController.getShowById); // newly added
router.post('/seats/lock', userController.lockSeats);
router.post('/book', userController.bookSeats);
router.get('/bookings/:userId', userController.getUserBookings);

module.exports = router;
