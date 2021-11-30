import React, { useState } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import fishSVG from '../assets/images/aquarium.svg';

export default function MarkerContainer({ spot, clusterer, index }) {
  const [openWindow, setOpenWindow] = useState(false);

  let date = spot.date_caught.split('-')
  let year = date[0].split('')
  year = year[2] + year[3]
  date = date[1] + '/' + date[2] + '/' + year
  let time = tConvert(spot.time_caught+':00')
  time = time.split(':')[0] + ':' + time.split(':')[1] + ' ' + time.split(' ')[1]


  function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }

  const handleToggleOpen = () => {
    setOpenWindow(true)
  }

  const handleToggleClose = () => {
    setOpenWindow(false)
  }

  return (
      <Marker
      key={spot.id}
      position={{
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.long)
      }}
      clusterer={clusterer}
      icon={{
        url: fishSVG,
        scaledSize: new window.google.maps.Size(30, 30)
      }}
      label={index.toString()}
      onClick={() => handleToggleOpen(spot.id)}
    >
    {openWindow ? (
      <InfoWindow onCloseClick={handleToggleClose}>
        <div className="info-window">
          <h3 className="fish-type-info-window">{spot.fish_type.toUpperCase()}</h3>
          <p className="user-caught">Caught By: {spot.user_id.toUpperCase()}</p>
          <p className="caught-on">Caught on: {date} at {time}</p>
          {spot.bait !== "" ? 
          <p className="bait-info-window">Bait Used: {spot.bait.toUpperCase()}</p>
          :
          null}
          {spot.tide !== "" ? 
          <p className="tide-info-window">Tide: {spot.tide.toUpperCase()}</p>
          :
          null}
          {spot.weather !== "" ?
          <>
          <p className="weather-info-window">Weather Condition: {spot.weather.toUpperCase()}</p>
          <p className="wind-info-window">Wind: {spot.weather.toUpperCase()}</p>
          </>
          :
          null}
          {spot.image !== '' ? 
          <img className="image-info-window" src={spot.image} alt="fish"/>
          :
          null}
        </div>
      </InfoWindow>
    ) : null}
    </Marker>
  );
}