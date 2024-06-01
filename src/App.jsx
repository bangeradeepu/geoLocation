// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Geolocation } from '@capacitor/geolocation';

// const App = () => {
//   const [location, setLocation] = useState({
//     latitude: null,
//     longitude: null,
//     error: null,
//   });
//   const [res, setRes] = useState([]);
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(
//         `https://65f278c9034bdbecc764dd86.mockapi.io/api/users`
//       );
//       setRes(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

// // Karnataka
// const deliveryBoundaries = [
//   { lat: 15.731545, lng: 73.359409 },
//   { lat: 16.906313, lng:  81.204831},
//   { lat: 11.601911, lng: 79.936210 },
//   { lat: 11.569206, lng: 73.559718 },
//   // Add more boundary coordinates as needed
// ];

//   useEffect(() => {
//     const getLocation = async () => {
//       try {
//         const coordinates = await Geolocation.getCurrentPosition();
//         const userLocation = {
//           latitude: coordinates.coords.latitude,
//           longitude: coordinates.coords.longitude,
//           error: null,
//         };
//         console.log('Capacitor Lat:', userLocation.latitude);
//         console.log('Capacitor Long:', userLocation.longitude);
//         setLocation(userLocation);

//         // Check if location is within delivery area (replace with your logic)
//         const isWithinDeliveryArea = checkDeliveryArea(userLocation);
//         if (!isWithinDeliveryArea) {
//           setLocation((prevState) => ({
//             ...prevState,
//             error: "Sorry, delivery is not available in your location.",
//           }));
//         }
//       } catch (error) {
//         if (!location.latitude || !location.longitude) {
//           setLocation((prevState) => ({
//             ...prevState,
//             error: "Please allow location access to use this application.",
//           }));
//         } else {
//           setLocation((prevState) => ({
//             ...prevState,
//             error: error.message,
//           }));
//         }
//       }
//     };

//     getLocation();
//   }, []);

//   const handleSubmit = async () => {
//     if (location.latitude && location.longitude) {
//       let mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
//       try {
//         await axios.post(
//           `https://65f278c9034bdbecc764dd86.mockapi.io/api/users`,
//           {
//             name: mapLink,
//             lat: location.latitude,
//             long: location.longitude,
//           }
//         );
//         fetchData();
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   };

//   const handleDelete = async (id) => {
//     console.log(id);
//     try {
//       const response = await axios.delete(
//         `https://65f278c9034bdbecc764dd86.mockapi.io/api/users/${id}`
//       );
//       setRes(response.data);
//       fetchData();
//       window.location.reload();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const checkDeliveryArea = (userLocation) => {
//     if (userLocation) {
//       let inside = false;
//       for (
//         let i = 0, j = deliveryBoundaries.length - 1;
//         i < deliveryBoundaries.length;
//         j = i++
//       ) {
//         const xi = deliveryBoundaries[i].lat;
//         const yi = deliveryBoundaries[i].lng;
//         const xj = deliveryBoundaries[j].lat;
//         const yj = deliveryBoundaries[j].lng;
//         const intersect =
//           yi > userLocation.longitude !== yj > userLocation.longitude &&
//           userLocation.latitude <
//             ((xj - xi) * (userLocation.longitude - yi)) / (yj - yi) + xi;
//         if (intersect) inside = !inside;
//       }
//       return inside;
//     }
//     return false; // If user location is not available, assume outside delivery area
//   };

//   return (
//     <div>
//       <h2>Geolocation</h2>
//       {location.error ? (
//         <p>Error: {location.error}</p>
//       ) : (
//         <div>
//           <p>Latitude: {location.latitude}</p>
//           <p>Longitude: {location.longitude}</p>
//           <button onClick={handleSubmit}>Submit</button>

//           <br />
//           <hr />
//         </div>
//       )}
//       {res.map((data) => (
//         <div key={data.id}>
//           <div>
//             <div>latitude:{data.lat}</div>
//             <div>longitude:{data.long}</div>
//           </div>
//           <br />
//           <a href={data.name} target="_blank" rel="noopener noreferrer">
//             Open in Google Maps
//           </a>
//           &nbsp;&nbsp;
//           <button onClick={() => handleDelete(data.id)}>Delete</button>
//           <hr />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default App;

import React, { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

const App = () => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [erroMsg, setErrorMsg] = useState("");
  const deliveryBoundaries = [
    { lat: 15.731545, lng: 73.359409 },
    { lat: 16.906313, lng: 81.204831 },
    { lat: 11.601911, lng: 79.93621 },
    { lat: 11.569206, lng: 73.559718 },
  ];

  const checkDeliveryArea = (userLocation) => {
    if (userLocation) {
      let inside = false;
      for (
        let i = 0, j = deliveryBoundaries.length - 1;
        i < deliveryBoundaries.length;
        j = i++
      ) {
        const xi = deliveryBoundaries[i].lat;
        const yi = deliveryBoundaries[i].lng;
        const xj = deliveryBoundaries[j].lat;
        const yj = deliveryBoundaries[j].lng;
        const intersect =
          yi > userLocation.longitude !== yj > userLocation.longitude &&
          userLocation.latitude <
            ((xj - xi) * (userLocation.longitude - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }
    return false;
  };

  const getCurrentLocation = async () => {
    try {
      const req = await Geolocation.checkPermissions();
      console.log("per:", req.location);
      if (req.location === "granted") {
        const coordinates = await Geolocation.getCurrentPosition();
        const userLocation = {
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        };
        setLat(userLocation.latitude);
        setLong(userLocation.longitude);
        console.log("Location", userLocation.latitude, userLocation.longitude);
        const isInDeliveryArea = checkDeliveryArea(userLocation);

        if (isInDeliveryArea) {
          // Update UI to indicate service is available
          console.log("Service available in your location");
          setErrorMsg("Service available in your location");
        } else {
          // Update UI to indicate service is not available
          console.log("Service not available in your location");
          setErrorMsg("Service not available in your location");
        }
      } else {
        setErrorMsg("Please give a location permission and try again");
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const reloadPage = () =>{
    window.location.reload();
  }
  // useEffect(() => {

  //   const getLocation = async () => {
  //     try {
  //       const coordinates = await Geolocation.getCurrentPosition();
  //       const userLocation = {
  //         latitude: coordinates.coords.latitude,
  //         longitude: coordinates.coords.longitude,
  //         error: null,
  //       };
  //       console.log('Capacitor Lat:', userLocation.latitude);
  //       console.log('Capacitor Long:', userLocation.longitude);

  //       // Check if location is within delivery area (replace with your logic)
  //       const isWithinDeliveryArea = checkDeliveryArea(userLocation);
  //       if (!isWithinDeliveryArea) {

  //       }
  //     } catch (error) {
  //       if (!location.latitude || !location.longitude) {

  //       } else {

  //       }
  //     }
  //   };

  //   getLocation();
  // }, []);
  return (
    <div>
      Locations Data
      {erroMsg === "Please give a location permission and try again" ? (
        <div>
          <p>{erroMsg}</p>
          <button onClick={reloadPage}>Reload Page</button>
        </div>
      ) : (
        <div>
          <p>{erroMsg}</p>
          <p>Lat:{lat}</p>
          <p>Long:{long}</p>
        </div>
      )}
    </div>
  );
};

export default App;
