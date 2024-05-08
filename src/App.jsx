import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });
  const [res,setRes] = useState([]);

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


  const handleSubmit = async() =>{
    let mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    try {
      await axios.post(`https://65f278c9034bdbecc764dd86.mockapi.io/api/users`,{
        name:mapLink,
        lat:location.latitude,
        long:location.longitude
      })
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  const fetchData = async() => {
    try {
      const response = await axios.get(`https://65f278c9034bdbecc764dd86.mockapi.io/api/users`);
      setRes(response.data);

    } catch (error) {
      console.error(error);
    }
   }
 
const handleDelete =  async(id) => {
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
  },[])

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
