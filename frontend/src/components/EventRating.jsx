import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ratingService } from '../services/api';
import { format } from 'date-fns';

const EventRating = ({ eventId }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch all ratings and user's rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);
        const response = await ratingService.getEventRatings(eventId);
        setRatings(response.data.ratings);
        setAverageRating(response.data.averageRating);
        setTotalRatings(response.data.totalRatings);

        if (isAuthenticated) {
          try {
            const userRatingRes = await ratingService.getUserRating(eventId);
            setUserRating(userRatingRes.data);
            setRatingValue(userRatingRes.data.rating);
            setReviewText(userRatingRes.data.review || '');
          } catch (err) {
            // User hasn't rated yet
            setUserRating(null);
          }
        }
      } catch (err) {
        setError('Failed to load ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [eventId, isAuthenticated]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please login to rate this event');
      return;
    }

    if (ratingValue === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      await ratingService.addRating({
        eventId,
        rating: ratingValue,
        review: reviewText,
      });

      setSuccess(true);
      setReviewText('');
      setRatingValue(0);

      // Refresh ratings
      const response = await ratingService.getEventRatings(eventId);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);

      // Refresh user's rating
      const userRatingRes = await ratingService.getUserRating(eventId);
      setUserRating(userRatingRes.data);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await ratingService.deleteRating(ratingId);

      // Refresh ratings
      const response = await ratingService.getEventRatings(eventId);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
      setTotalRatings(response.data.totalRatings);
      setUserRating(null);
      setRatingValue(0);
      setReviewText('');
    } catch (err) {
      setError('Failed to delete rating');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 6 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 3,
          color: isDarkMode ? '#F1F5F9' : '#1E293B',
        }}
      >
        ⭐ Event Ratings
      </Typography>

      {/* Rating Summary */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: isDarkMode ? '#1E293B' : '#F8FAFC',
          border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#FCD34D',
                mb: 1,
              }}
            >
              {averageRating}
            </Typography>
            <Rating value={averageRating} readOnly precision={0.1} />
            <Typography
              variant="caption"
              sx={{
                color: isDarkMode ? '#94A3B8' : '#64748B',
                mt: 1,
                display: 'block',
              }}
            >
              {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
            </Typography>
          </Box>

          {/* Rating Distribution */}
          <Box sx={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratings.filter((r) => r.rating === star).length;
              const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
              return (
                <Box
                  key={star}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ width: 20 }}>
                    {star}⭐
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 8,
                      bgcolor: isDarkMode ? '#334155' : '#E2E8F0',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? '#94A3B8' : '#64748B',
                      width: 30,
                      textAlign: 'right',
                    }}
                  >
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Submit Rating Form */}
      {isAuthenticated ? (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            bgcolor: isDarkMode ? '#1E293B' : '#F8FAFC',
            border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: isDarkMode ? '#F1F5F9' : '#1E293B',
            }}
          >
            {userRating ? '✏️ Update Your Rating' : '📝 Share Your Feedback'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Rating submitted successfully!
            </Alert>
          )}

          <form onSubmit={handleSubmitRating}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: isDarkMode ? '#CBD5E1' : '#64748B' }}>
                How would you rate this event?
              </Typography>
              <Rating
                value={ratingValue}
                onChange={(e, newValue) => setRatingValue(newValue)}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your feedback (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366F1',
                  },
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  color: isDarkMode ? '#64748B' : '#94A3B8',
                  opacity: 1,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={submitting || ratingValue === 0}
              sx={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              }}
            >
              {submitting ? <CircularProgress size={24} /> : 'Submit Rating'}
            </Button>

            {userRating && (
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteRating(userRating._id)}
                sx={{ ml: 2 }}
              >
                Delete Rating
              </Button>
            )}
          </form>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please login to rate this event.
        </Alert>
      )}

      {/* Ratings List */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          color: isDarkMode ? '#F1F5F9' : '#1E293B',
        }}
      >
        Recent Ratings
      </Typography>

      {ratings.length === 0 ? (
        <Alert severity="info">No ratings yet. Be the first to rate this event!</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {ratings.map((rating) => (
            <Paper
              key={rating._id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: isDarkMode ? '#1E293B' : '#FFFFFF',
                border: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#6366F1' }}>
                    {rating.userId.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: isDarkMode ? '#F1F5F9' : '#1E293B',
                      }}
                    >
                      {rating.userId.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={rating.rating} readOnly size="small" />
                      <Chip
                        label={rating.userId.department}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDarkMode ? '#94A3B8' : '#64748B',
                  }}
                >
                  {format(new Date(rating.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>

              {rating.review && (
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode ? '#CBD5E1' : '#475569',
                    mt: 1,
                  }}
                >
                  {rating.review}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventRating;
