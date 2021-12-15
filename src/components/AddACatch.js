import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import SaveASpotMapContainer from "./SaveASpotMapContainer"
import { API, Storage } from "aws-amplify";
import { createSpot as createSpotMutation } from "../graphql/mutations";

const WEATHERKEY = process.env.REACT_APP_WEATHER_KEY;
const TIDEKEY = process.env.REACT_APP_TIDE_KEY;

export default function AddACatch({ user, setSpots, spots }) {
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
  const spotInput = useRef(null);
  const navigate = useNavigate();

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
    
    const inputtedDate = new Date(data.date_caught)
    let inputtedDateTime = inputtedDate.getTime() / 1000
    
    const time = data.time_caught.split(":")
    const hours = parseInt(time[0])
    const minutes = parseInt(time[1])
    const unixTime = hours*60*60 + minutes*60
    const tzOffset = inputtedDate.getTimezoneOffset()*60
    inputtedDateTime = inputtedDateTime + unixTime + tzOffset;
    
    const nowDate = new Date()
    const latestDate = new Date(nowDate.getTime() - (5*24*60*60*1000)).getTime() / 1000
    
    
    if(inputtedDateTime > Math.floor(latestDate)){
      fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${String(clickedCoords.lat)}&lon=${String(clickedCoords.lng)}&dt=${Math.floor(inputtedDateTime)}&appid=${WEATHERKEY}&units=imperial`)
      .then(res => res.json())
      .then(json => data.weather = JSON.stringify(json.current))
    }
  
    const endTime = inputtedDateTime - tzOffset + (60*60*6)

    await fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${clickedCoords.lat}&lng=${clickedCoords.lng}&start=${inputtedDateTime-tzOffset-(60*60*6)}&end=${endTime}`, {
    headers: {
    'Authorization': TIDEKEY
    }
    }).then((response) => response.json()).then((jsonData) => {
      const tides = jsonData.data
      if(jsonData.data.length === 1){
        const tideTime = new Date(tides[0].time).getTime() / 1000
        if(jsonData.data[0].type==="high"){
          if(inputtedDateTime-tzOffset >= tideTime-(60*60) && inputtedDateTime-tzOffset <= tideTime+(60*30)){
            data.tide = "High"
          } else if(inputtedDateTime-tzOffset > tideTime) {
            data.tide = "Falling"
          } else if(inputtedDateTime-tzOffset < tideTime) {
            data.tide = "Rising"
          }
        }else if(jsonData.data[0].type==="low"){
          if(inputtedDateTime-tzOffset >= tideTime-(60*60) && inputtedDateTime-tzOffset <= tideTime+(60*30)){
            data.tide = "Low"
          } else if(inputtedDateTime-tzOffset > tideTime) {
            data.tide = "Rising"
          } else if(inputtedDateTime-tzOffset < tideTime) {
            data.tide = "Falling"
          }
        }
      } else if(jsonData.data.length === 2){
        const highTideTime = new Date(tides[0].time).getTime() / 1000
        const lowTideTime = new Date(tides[1].time).getTime() / 1000
        if(inputtedDateTime-tzOffset >= highTideTime-(60*60) && inputtedDateTime-tzOffset <= highTideTime+(60*30) && jsonData.data[0].type==="high"){
          data.tide = "High"
        }else if(inputtedDateTime-tzOffset >= lowTideTime-(60*60) && inputtedDateTime-tzOffset <= lowTideTime+(60*30) && jsonData.data[1].type==="low"){
          data.tide = "Low"
        }else if(inputtedDateTime-tzOffset > highTideTime && inputtedDateTime-tzOffset < lowTideTime){
          data.tide = "Falling"
        }else if(inputtedDateTime-tzOffset > lowTideTime && inputtedDateTime-tzOffset < highTideTime){
          data.tide = "Rising"
        }
      } else if(jsonData.data.length === 0){
        data.tide = ""
      }
    }).catch((error) => {
      console.log(error)
    })

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
      navigate("/");
    }
  };
    

  return (
  <div className="add-a-catch-page">
    <Navbar user={user} />
    {!clickedCoords ? 
    <div style={{ backgroundColor: '#414141', padding: "8px", height: "3vh", lineHeight: "3vh", textAlign: "center", fontSize: "1.5rem", color: "white" }}>
        Click the map to save a spot!
    </div> :
    null}
    <div className="add-a-catch-wrapper" >
      <SaveASpotMapContainer setClickedCoords={setClickedCoords} clickedCoords={clickedCoords} spotInput={spotInput} />
      {clickedCoords ? 
      <div className="spot-form">
        <h1>Save Your Spot</h1>
        {!clickedCoords ? 
        <h2>Click your Spot on the Map</h2> :
        <form className="add-spot-form" onSubmit={handleSubmit}>
          <label htmlFor="fishCaught" >Type of Fish</label><br/>
          <input ref={spotInput} type="text" name="fish_type" className="input-field" id="fishCaught" value={spotData.fish_type} onChange={handleChange} /><br/><br/>
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
      </div> : 
      null}
    </div>
  </div>
  )
}