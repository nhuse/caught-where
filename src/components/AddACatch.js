import { useState } from "react";
import Navbar from "./Navbar"
import SaveASpotMapContainer from "./SaveASpotMapContainer"
import { API, Storage } from "aws-amplify";
import { createSpot as createSpotMutation } from "../graphql/mutations";

export default function AddACatch({ user, setSpots, spots, fetchSpots }) {
  const initialFormState = {
    user_id: "",
    fish_type: "",
    date_caught: "",
    time_caught: "",
    bait: "",
    weather: "",
    tide: "",
    lat: "",
    long: "",
    public: false,
    image: ""
  }

  const [clickedCoords, setClickedCoords] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [spotData, setSpotData] = useState(initialFormState);


  function handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "public") {
      setIsPublic(value);
    }
    setSpotData({...spotData,
      [name]: value
    })
  }

  async function handleImageChange(e) {
    if(!e.target.files[0]) return;
    const file = e.target.files[0];
    setSpotData({...spotData,
      image: file.name
    })
    console.log(file.name)
    await Storage.put(file.name, file)
    }

  async function handleSubmit(e) {
    e.preventDefault();
    let data = {...spotData,
      user_id: user.username,
      weather: "",
      tide: "",
      lat: String(clickedCoords.lat),
      long: String(clickedCoords.lng),
      public: isPublic
    }
    if(!data.lat || !data.long || !data.user_id){
      alert("Error")
    } else {
      await API.graphql({ query: createSpotMutation, variables: { input: data } });
      if (data.image) {
        const image = await Storage.get(data.image)
        data.image = image;
      }
      setSpots([...spots, data]);
      setSpotData(initialFormState);
      setClickedCoords(null);
    }
  }

  console.log(spots)
  return (
  <div className="add-a-catch-page">
    <Navbar user={user} />
    <div className="add-a-catch-wrapper" >
      <SaveASpotMapContainer setClickedCoords={setClickedCoords} clickedCoords={clickedCoords} />
      <div className="spot-form" style={{ width: "48%" }}>
        <h1>Save Your Spot</h1>
        {!clickedCoords ? 
        <h2>Click your Spot on the Map</h2> :
        <form className="add-spot-form" onSubmit={handleSubmit}>
          <label htmlFor="fishCaught" >Type of Fish</label><br/>
          <input type="text" name="fish_type" className="input-field" id="fishCaught" value={spotData.fish_type} onChange={handleChange} /><br/><br/>
          <label htmlFor="date" >Date</label><br/>
          <input type="date" name="date_caught" className="input-field" id="date" value={spotData.date_caught} onChange={handleChange} /><br/><br/>
          <label htmlFor="time" >Time</label><br/>
          <input type="time" name="time_caught" className="input-field" id="time" value={spotData.time_caught} onChange={handleChange} /><br/><br/>
          <label htmlFor="bait">Bait/Lure</label><br/>
          <input type="text" name="bait" className="input-field" id="bait" value={spotData.bait} onChange={handleChange} /><br/><br/>
          <label htmlFor="image">Do you have a picture?</label><br/>
          <input type="file" 
          name="image" className="img-input-field" 
          id="image" accept="image/*" 
          onChange={handleImageChange} /><br/><br/>
          <label htmlFor="public">Do you want this spot public?</label><br/>
          <input type="checkbox" name="public" id="public" checked={isPublic} onChange={handleChange} /><br/><br/>
          <button type="submit" className="submit-button">Submit</button>
        </form> }
      </div>
    </div>
  </div>
  )
}