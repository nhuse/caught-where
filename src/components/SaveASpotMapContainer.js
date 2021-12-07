import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const SaveASpotMapContainer = ({ setClickedCoords, clickedCoords, spotInput }) => {
  const [currentPosition, setCurrentPosition] = useState({lat: 0, lng: 0});
  const [markerShown, setMarkerShown] = useState(false);
  let mapStyles={
    height: '89vh',
    width: '100%',
  };

  const success = (pos) => {
    const currentPosition = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }
    setCurrentPosition(currentPosition);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  if(clickedCoords) {
    mapStyles = {
      height: '93.5vh',
      width: '100%',
    }
  }

  const handleMapClick = (e) => {
    setClickedCoords({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
    setMarkerShown(true);
    spotInput.current.focus();
  }
  
  return (
    <div className="sas-map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          onClick={handleMapClick}
          mapContainerStyle={mapStyles}
          zoom={12}
          center={currentPosition} 
        >
          {markerShown && <Marker position={clickedCoords} />}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default SaveASpotMapContainer;