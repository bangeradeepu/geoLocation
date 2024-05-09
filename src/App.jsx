import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });
  const [res, setRes] = useState([]);
  const deliveryBoundaries = [
    { lat: 13.130555, lng: 74.812233 },
    { lat: 13.130557, lng: 74.812415 },
    { lat: 13.130440, lng: 74.812412 },
    { lat: 13.130446, lng: 74.812229 }
    // Add more boundary coordinates as needed
  ];

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
            if (!location.latitude || !location.longitude) {
              setLocation(prevState => ({
                ...prevState,
                error: "Please turn on location services to use this application."
              }));
            } else {
              setLocation(prevState => ({
                ...prevState,
                error: error.message
              }));
            }
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

  }, []);


  const handleSubmit = async () => {
    if (checkDeliveryArea()) {
      let mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
      try {
        await axios.post(`https://65f278c9034bdbecc764dd86.mockapi.io/api/users`, {
          name: mapLink,
          lat: location.latitude,
          long: location.longitude
        })
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('Sorry, delivery is not available in your location.');
    }
  }

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://65f278c9034bdbecc764dd86.mockapi.io/api/users`);
      setRes(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async (id) => {
    console.log(id)
    try {
      const response = await axios.delete(`https://65f278c9034bdbecc764dd86.mockapi.io/api/users/${id}`);
      setRes(response.data);
      fetchData();
      window.location.reload()
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const checkDeliveryArea = () => {
    if (location.latitude && location.longitude) {
      let inside = false;
      for (let i = 0, j = deliveryBoundaries.length - 1; i < deliveryBoundaries.length; j = i++) {
        const xi = deliveryBoundaries[i].lat;
        const yi = deliveryBoundaries[i].lng;
        const xj = deliveryBoundaries[j].lat;
        const yj = deliveryBoundaries[j].lng;
        const intersect = ((yi > location.longitude) !== (yj > location.longitude)) &&
          (location.latitude < (xj - xi) * (location.longitude - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }
    return false; // If user location is not available, assume outside delivery area
  };

  return (
    <div>
      <h2>Geolocation</h2>
      {location.error ? (
        <p>Error: {location.error}</p>
      ) : (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <button onClick={handleSubmit}>Submit</button>

          <br />
          <hr />
          {res.map((data) => (
            <div key={data.id}>
              <div>
                {data.lat},{data.long}
              </div>
              <a
                href={data.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
              <button onClick={() => handleDelete(data.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
