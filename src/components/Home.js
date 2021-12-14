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
      <div className="default-spot">
        {isSettingDefSpot ? 
        <>
        Click the map to save a default location.
        <div onClick={() => setIsSettingDefSpot(false)} className="nav-div" id="cancel-def-spot">
          <div id='cancel-txt'>
            Cancel
          </div>
        </div>
        </>
        :
        userDefault ?
        <div className="hasDefaultSpot" >
          <div className="nav-div" id="update-def-spot" onClick={handleUpdateDefSpotClick} >
            Update Default Location
          </div>
          <div className="nav-div" id="remove-def-spot" onClick={handleDeleteDefSpotClick} >
            Remove Default Location
          </div>
        </div>
        :
        <div className="nav-div" id="add-def-spot" onClick={handleDefSpotClick} >
          Set a Default Location
        </div>
        }
      </div>
      <MapContainer spots={spots} isInSpots={false} user={user} fetchSpots={fetchSpots} isSettingDefSpot={isSettingDefSpot} setIsSettingDefSpot={setIsSettingDefSpot} userDefault={userDefault} listDefLocs={listDefLocs} />
    </div>
  )
}