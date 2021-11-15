import './App.css';
import Home from './components/Home';
import AddACatch from './components/AddACatch';
import YourSpots from './components/YourSpots';
import { Auth, API, Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { listSpots } from './graphql/queries';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// const initialFormState = {
//   user_id: '', 
//   fish_type: '', 
//   time_caught: '', 
//   bait: '',
//   weather: '',
//   tide: '',
//   lat_long: '',
//   public: false
// }

function App() {
  const [user, setUser] = useState();
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(user => setUser(user))
    .catch(err => console.log(err))
    fetchSpots();
  }, [])

  async function fetchSpots() {
    const apiData = await API.graphql({ query: listSpots });
    const spotsFromAPI = apiData.data.listSpots.items;
    await Promise.all(spotsFromAPI.map(async spot => {
      if(spot.image) {
        const image = await Storage.get(spot.image);
        spot.image = image;
      }
      return spot;
    }))
    setSpots(apiData.data.listSpots.items);
  }

  // async function updateSpot() {
  //   if(!formData.user_id || formData.lat_long) return;
  //   await API.graphql({ query: updateSpotMutation, variables: { input: formData } });
  //   const updatedSpotsArr = spots.filter
  //   setSpots([...spots, formData]);
  //   setFormData(initialFormState);
  // }

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home user={user} spots={spots} />} />
        <Route exact path="/add_a_spot" element={<AddACatch user={user} spots={spots} setSpots={setSpots} fetchSpots={fetchSpots} />} />
        <Route exact path="/your_spots" element={<YourSpots user={user} spots={spots} />} />
      </Routes>
    </div>
  );
}

export default withAuthenticator(App);