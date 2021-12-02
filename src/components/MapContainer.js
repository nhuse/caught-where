import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import MarkerContainer from './MarkerContainer';

const MapContainer = ({ spots, isInSpots, user, fetchSpots }) => {
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
    height: '93vh',
    width: '100%',
  }

  return (
    <div className="map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        {!isInSpots ?
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={11}
          center={currentPosition}>
            {
              currentPosition.lat &&
              (
                <Marker position={currentPosition} />
              )
            }
            <MarkerClusterer options={{
              averageCenter: true,
              maxZoom: 12
            }}>
              {clusterer => 
                spots ? spots.map((spot, index) => {
                  return (
                    <MarkerContainer key={spot.id} spot={spot} spots={spots} clusterer={clusterer} index={index} isInSpots={isInSpots} user={user} fetchSpots={fetchSpots} />
                  )
                })
                :
                null
              }
            </MarkerClusterer>
        </GoogleMap> 
        :
        <GoogleMap
          mapContainerStyle={{
            height: '88vh',
            width: '100%'
          }}
          zoom={3}
          center={currentPosition}>
            <MarkerClusterer options={{
              averageCenter: true,
              maxZoom: 12
            }}>
              {clusterer => 
                spots ? spots.map((spot, index) => {
                  return (
                    <MarkerContainer key={spot.id} spot={spot} spots={spots} clusterer={clusterer} index={index} isInSpots={isInSpots} user={user} fetchSpots={fetchSpots} />
                  )
                })
                :
                null
              }
            </MarkerClusterer>
        </GoogleMap>}
      </LoadScript>
    </div>
  )
}

export default MapContainer;