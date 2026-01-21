const Rating = require('../models/Rating');
const Event = require('../models/Event');

// Add or update a rating
exports.addRating = async (req, res) => {
  try {
    const { eventId, rating, review } = req.body;
    const userId = req.user.id;

    if (!eventId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating data' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user already rated this event
    let existingRating = await Rating.findOne({ eventId, userId });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      await existingRating.save();
      return res.status(200).json({ message: 'Rating updated', rating: existingRating });
    } else {
      // Create new rating
      const newRating = new Rating({
        eventId,
        userId,
        rating,
        review: review || '',
      });
      await newRating.save();
      return res.status(201).json({ message: 'Rating added', rating: newRating });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error adding rating', error: err.message });
  }
};

// Get all ratings for an event
exports.getEventRatings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const ratings = await Rating.find({ eventId })
      .populate('userId', 'name department')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.status(200).json({
      averageRating: parseFloat(avgRating),
      totalRatings: ratings.length,
      ratings,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching ratings', error: err.message });
  }
};

// Get user's rating for an event
exports.getUserRating = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findOne({ eventId, userId });

    if (!rating) {
      return res.status(404).json({ message: 'No rating found' });
    }

    res.status(200).json(rating);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rating', error: err.message });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.id;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    // Check if user owns the rating
    if (rating.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Rating.findByIdAndDelete(ratingId);
    res.status(200).json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting rating', error: err.message });
  }
};
