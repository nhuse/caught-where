import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import fishSVG from '../assets/images/aquarium.svg';

const MapContainer = ({ spots }) => {
  const [currentPosition, setCurrentPosition] = useState({lat: 0, lng: 0});

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
    height: '93.94vh',
    width: '100%',
  }

  return (
    <div className="map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          // onClick={handleMapClick}
          mapContainerStyle={mapStyles}
          zoom={13}
          center={currentPosition}>
            {
              currentPosition.lat &&
              (
                <Marker position={currentPosition} />
              )
            }
            <MarkerClusterer options={{
              averageCenter: true
            }}>
              {clusterer => 
                spots ? spots.map(spot => {
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
                    />
                  )
                })
                :
                null
              }
            </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default MapContainer;