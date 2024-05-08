import React, { useState, useEffect } from 'react';

const AudioParamMap = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null
            });
          },
          error => {
            setLocation(prevState => ({
              ...prevState,
              error: error.message
            }));
          }
        );
      } else {
        setLocation(prevState => ({
          ...prevState,
          error: "Geolocation is not supported by this browser."
        }));
      }
    };

    getLocation();

  }, []); // Empty array as second argument to run effect only once when component mounts

  return (
    <div>
      <h2>Geolocation</h2>
      {location.error ? (
        <p>Error: {location.error}</p>
      ) : (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default AudioParamMap;
