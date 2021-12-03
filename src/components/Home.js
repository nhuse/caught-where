import Navbar from '../components/Navbar';
import MapContainer from '../components/MapContainer';
import { useState, useEffect } from 'react';
import { listUserDefaultLocations } from '../graphql/queries';
import { deleteUserDefaultLocation } from '../graphql/mutations';
import { API } from "aws-amplify";

export default function Home({ user, spots, fetchSpots }) {
  const [isSettingDefSpot, setIsSettingDefSpot] = useState(false);
  const [userDefault, setUserDefault] = useState(null);

  spots = spots.filter(spot => spot.public || spot.user_id === user.username);

  const handleDefSpotClick = () => {
    setIsSettingDefSpot(true);
  }

  async function handleDeleteDefSpotClick() {
    const data = {
      id: userDefault.id
    }
    await API.graphql({ query: deleteUserDefaultLocation, variables: {input: data} });
    setUserDefault(null);
  }

  const handleUpdateDefSpotClick = () => {
    setIsSettingDefSpot(true);
  }

  async function listDefLocs() {
    if(user) {
      const apiData = await API.graphql({ query: listUserDefaultLocations });
      const def = apiData.data.listUserDefaultLocations.items.find(item => item.user_id === user.username);
      if(def){
        setUserDefault({
          id: def.id,
          lat: parseFloat(def.lat),
          lng: parseFloat(def.long)
        });
      }
    }
  }

  useEffect(() => {
    listDefLocs()
  }, [user]);

  return (
    <div className="home-wrapper">
      <Navbar />
      <div style={{ backgroundColor: '#414141', padding: "8px", height: "3vh", lineHeight: "3vh", textAlign: "center", fontSize: "18px", color: "white" }}>
        {isSettingDefSpot ? 
        <>
        Click the map to save a default location.
        <button onClick={() => setIsSettingDefSpot(false)} className="nav-div" id="def-spot" style={{ marginLeft: "20px" }}>
          Cancel
        </button>
        </>
        :
        userDefault ?
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button className="nav-div" id="def-spot" onClick={handleUpdateDefSpotClick} >
            Update Default Location
          </button>
          <button className="nav-div" id="def-spot" onClick={handleDeleteDefSpotClick} >
            Remove Default Location
          </button>
        </div>
        :
        <button className="nav-div" id="def-spot" onClick={handleDefSpotClick} >
          Set a Default Location
        </button>
        }
      </div>
      <MapContainer spots={spots} isInSpots={false} user={user} fetchSpots={fetchSpots} isSettingDefSpot={isSettingDefSpot} setIsSettingDefSpot={setIsSettingDefSpot} userDefault={userDefault} listDefLocs={listDefLocs} />
    </div>
  )
}