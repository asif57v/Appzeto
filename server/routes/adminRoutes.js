const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/movies', adminController.createMovie);
router.get('/movies', adminController.getMovies);
router.put('/movies/:id', adminController.updateMovie);
router.post('/shows', adminController.createShow);
router.get('/shows', adminController.getShows);

module.exports = router;
