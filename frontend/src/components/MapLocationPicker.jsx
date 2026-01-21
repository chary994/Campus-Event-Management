import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 28.7041,
  lng: 77.1025,
};

const MapLocationPicker = ({ onLocationSelect, initialLocation, initialName }) => {
  const [location, setLocation] = useState(
    initialLocation || defaultCenter
  );
  const [locationName, setLocationName] = useState(initialName || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const onMapClick = useCallback((e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    setLocation(newLocation);
    onLocationSelect(newLocation, locationName);
  }, [locationName, onLocationSelect]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          searchQuery
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.results.length === 0) {
        setError('Location not found');
        setLoading(false);
        return;
      }

      const result = data.results[0];
      const newLocation = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };

      setLocation(newLocation);
      setLocationName(result.formatted_address);
      onLocationSelect(newLocation, result.formatted_address);

      if (mapRef.current) {
        mapRef.current.panTo(newLocation);
        mapRef.current.setZoom(15);
      }
    } catch (err) {
      setError('Failed to search location');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Alert severity="error">
        <strong>Google Maps API Key is missing!</strong>
        <br />
        Please add <code>REACT_APP_GOOGLE_MAPS_API_KEY</code> to your <code>.env.local</code> file.
        <br />
        Get your API key from: <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">Google Cloud Console</a>
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
        📍 Select Event Location on Map
      </Typography>

      <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
        <TextField
          fullWidth
          label="Search Location"
          placeholder="Enter city, venue name, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mb: 1 }}
        />
        <Typography variant="caption" sx={{ display: 'block', color: '#666', mb: 2 }}>
          Or click on the map to select a location
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {locationName && (
          <Alert severity="success">
            Selected: <strong>{locationName}</strong>
          </Alert>
        )}
      </Paper>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
        onLoad={(map) => (mapRef.current = map)}
        onClick={onMapClick}
      >
        <Marker
          position={location}
          title={locationName || 'Event Location'}
        />
      </GoogleMap>

      <Paper sx={{ p: 2, mt: 2, backgroundColor: '#e3f2fd' }}>
        <Typography variant="caption">
          <strong>Coordinates:</strong> Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MapLocationPicker;
