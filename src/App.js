import './App.css';
import Home from './components/Home';
import { Auth, API } from 'aws-amplify';
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
    setSpots(apiData.data.listSpots.items);
  }
  // async function createSpot() {
  //   if(!formData.user_id || formData.lat_long) return;
  //   await API.graphql({ query: createSpotMutation, variables: { input: formData } });
  //   setSpots([...spots, formData]);
  //   setFormData(initialFormState);
  // }

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
        <Route exact path="/" element={<Home user={user} />} />
      </Routes>
    </div>
  );
}

export default withAuthenticator(App);