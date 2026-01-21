const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  addRating,
  getEventRatings,
  getUserRating,
  deleteRating,
} = require('../controllers/ratingController');

// Add or update rating (protected)
router.post('/add', authMiddleware, addRating);

// Get all ratings for an event
router.get('/event/:eventId', getEventRatings);

// Get user's rating for an event (protected)
router.get('/event/:eventId/user-rating', authMiddleware, getUserRating);

// Delete a rating (protected)
router.delete('/:ratingId', authMiddleware, deleteRating);

module.exports = router;
