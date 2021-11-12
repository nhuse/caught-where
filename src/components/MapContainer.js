import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const MapContainer = () => {
  const [currentPosition, setCurrentPosition] = useState({});
  const [clickedCoords, setClickedCoords] = useState({});

  const success = (pos) => {
    const currentPosition = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }
    setCurrentPosition(currentPosition);
  }

  const handleMapClick = (e) => {
    setClickedCoords({
      lat: e.latLng.lat(), 
      lng: e.latLng.lng()
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  const mapStyles = {
    height: '93.94vh',
    width: '100%',
  }

  return (
    <div className="map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          onClick={handleMapClick}
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition}>
            {
              currentPosition.lat &&
              (
                <Marker position={currentPosition} />
              )
            }
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default MapContainer;