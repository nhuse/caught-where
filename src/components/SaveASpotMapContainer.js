import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const SaveASpotMapContainer = ({ setClickedCoords, clickedCoords }) => {
  const [currentPosition, setCurrentPosition] = useState({lat: 0, lng: 0});
  const [markerShown, setMarkerShown] = useState(false);

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

  const mapStyles = {
    height: '92vh',
    width: '100%',
  }

  const handleMapClick = (e) => {
    setClickedCoords({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
    setMarkerShown(true);
  }
  
  return (
    <div className="sas-map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          onClick={handleMapClick}
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition} >
          {markerShown && <Marker position={clickedCoords} />}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default SaveASpotMapContainer;