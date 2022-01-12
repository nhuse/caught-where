import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import MarkerContainer from './MarkerContainer';
import { API } from "aws-amplify";
import { createUserDefaultLocation, updateUserDefaultLocation } from '../graphql/mutations';

const MapContainer = ({ spots, isInSpots, user, fetchSpots, isSettingDefSpot, setIsSettingDefSpot, userDefault, listDefLocs }) => {
  const [currentPosition, setCurrentPosition] = useState({lat: 37, lng: -95});
  
  const success = (pos) => {
    const currentPosition = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    }
    setCurrentPosition(currentPosition);
  }

  async function handleMapClick(e) {
    let data = {
      user_id: user.username,
      lat: String(e.latLng.lat()),
      long: String(e.latLng.lng())
    }
    if (userDefault) {
      data = {...data,
        id: userDefault.id
      }
      await API.graphql({ query: updateUserDefaultLocation, variables: { input: data } });
    } else {
      await API.graphql({ query: createUserDefaultLocation, variables: { input: data } });
    }
    await listDefLocs()
    setIsSettingDefSpot(false)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);

  const mapStyles = {
    height: '89vh',
    width: '100%',
  }

  if(isSettingDefSpot) {
    return (
      <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
        onClick={handleMapClick}
        mapContainerStyle={mapStyles}
        zoom={9}
        center={userDefault ? userDefault : currentPosition}      
        />
      </LoadScript>
    )
  } else {
  return (
    <div className="map-wrapper">
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        {!isInSpots ?
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={ currentPosition.lat === 37 && currentPosition.lng === -95 ?  4 : 7 }
          center={userDefault ? userDefault : currentPosition}>
            {
              currentPosition.lat &&
              (
                <Marker position={userDefault ? userDefault : currentPosition} />
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
            height: '89vh',
            width: '100%'
          }}
          zoom={4}
          center={userDefault ? userDefault : currentPosition}>
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
  )}
}

export default MapContainer;