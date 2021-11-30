import { useState, useEffect } from 'react';
import { GoogleMap, Marker, LoadScript, MarkerClusterer } from '@react-google-maps/api';
import MarkerContainer from './MarkerContainer';

const MapContainer = ({ spots }) => {
  const [currentPosition, setCurrentPosition] = useState({lat: 0, lng: 0});
  // const spots = [{
  //   id: 1,
  //   user_id: "dummy account",
  //   fish_type: "redfish",
  //   date_caught: "2020-01-01",
  //   time_caught: "15:30",
  //   bait: "mullet",
  //   weather: "sunny",
  //   tide: "high",
  //   lat: "19.65",
  //   long: "20.38",
  //   public: true,
  //   image: ""
  // },
  // {
  //   id: 2,
  //   user_id: "dummy account1",
  //   fish_type: "Trout",
  //   date_caught: "2020-01-01",
  //   time_caught: "12:00",
  //   bait: "mullet",
  //   weather: "sunny",
  //   tide: "high",
  //   lat: "39.65",
  //   long: "28.38",
  //   public: false,
  //   image: ""
  // }]

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
                spots ? spots.filter(spot => spot.public).map((spot,index) => {
                  return (
                    <MarkerContainer key={spot.id} spot={spot} clusterer={clusterer} index={index} />
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