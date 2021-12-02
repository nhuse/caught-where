import React, { useState } from 'react';
import { InfoWindow, Marker } from '@react-google-maps/api';
import { API } from "aws-amplify";
import fish from '../assets/images/fish.png';
import { updateSpot } from "../graphql/mutations";

const WEATHERKEY = process.env.REACT_APP_WEATHER_KEY;
const TIDEKEY = process.env.REACT_APP_TIDE_KEY;

export default function MarkerContainer({ spot, clusterer, isInSpots, user, fetchSpots }) {
  const [openWindow, setOpenWindow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({})
  const [isPublic, setIsPublic] = useState(false);
  const [coords, setCoords] = useState({});

  const degToCompass = (num) => {
    const val = parseInt((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let data = {
      id: spot.id,
      user_id: user.username,
      bait: formData.bait,
      date_caught: formData.date_caught,
      time_caught: formData.time_caught,
      fish_type: formData.fish_type,
      public: isPublic,
      weather: "",
      tide: "",
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
      fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${String(coords.lat)}&lon=${String(coords.lng)}&dt=${Math.floor(inputtedDateTime)}&appid=${WEATHERKEY}&units=imperial`)
      .then(res => res.json())
      .then(json => data.weather = JSON.stringify(json.current))
    }
  
    const endTime = inputtedDateTime - tzOffset + (60*60*6)

    await fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${coords.lat}&lng=${coords.lng}&start=${inputtedDateTime-tzOffset-(60*60*6)}&end=${endTime}`, {
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

    await API.graphql({ query: updateSpot, variables: { input: data } });

    setFormData({});
    setCoords(null);
    setIsEditing(false);
    fetchSpots();
  };
  
  let parsedWeather;
  let windDir;
  if(spot.weather !== "") {
    parsedWeather = JSON.parse(spot.weather);
    windDir = degToCompass(parsedWeather.wind_deg)
  }

  let date = spot.date_caught.split('-')
  let year = date[0].split('')
  year = year[2] + year[3]
  date = date[1] + '/' + date[2] + '/' + year
  let time = tConvert(spot.time_caught+':00')
  time = time.split(':')[0] + ':' + time.split(':')[1] + ' ' + time.split(' ')[1]


  function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }


  const handleToggleOpen = () => {
    setOpenWindow(true)
  }

  const handleToggleClose = () => {
    setOpenWindow(false)
  }

  const handleEditToggleClose = () => {
    setOpenWindow(false)
    setIsEditing(false)
  }

  const handleEditClick = (spot) => {
    setIsEditing(true)
    setFormData(spot)
    setCoords({
      lat: spot.lat,
      lng: spot.long
    })
  }

  function handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "public") {
      setIsPublic(value);
    }
    setFormData({...formData,
      [name]: value
    })
  }

  return (
    !isEditing ?
      <Marker
      key={spot.id}
      position={{
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.long)
      }}
      clusterer={clusterer}
      icon={{
        url: fish,
        scaledSize: new window.google.maps.Size(30, 30)
      }}
      onClick={() => handleToggleOpen(spot.id)}
      >
      {openWindow ? (
        <InfoWindow onCloseClick={handleToggleClose}>
          <div className="info-window">
            <h3 className="fish-type-info-window">{spot.fish_type.toUpperCase()}</h3>
            <p className="user-caught">Caught By: {spot.user_id.toUpperCase()}</p>
            <p className="caught-on">Caught on: {date} at {time}</p>
            {spot.bait !== "" ? 
            <p className="bait-info-window">Bait Used: {spot.bait.toUpperCase()}</p>
            :
            null}
            {spot.tide !== "" ? 
            <p className="tide-info-window">Tide: {spot.tide.toUpperCase()}</p>
            :
            null}
            <br/>
            {spot.weather !== "" ?
            <div >
              <h4 className="weather-info-header">Weather</h4>
              <ul style={{listStyle: "none", textAlign: "center", padding: "0" }}>
                <li>Condition: {parsedWeather.weather[0].main.toUpperCase()}</li>
                <li>Winds: {Math.floor(parsedWeather.wind_speed)} MPH {windDir}</li>
                <li>Temperature: {Math.floor(parsedWeather.temp)} {'\u00B0'}F</li>
              </ul>
            </div>
            :
            null}
            {spot.image !== '' ?
            <img className="image-info-window" src={spot.image} alt="fish"/>
            :
            null}<br/>
            {isInSpots ? 
            <button onClick={() => handleEditClick(spot)}>
              Edit this Spot
            </button>
            : null}
          </div>
        </InfoWindow>
      ) : null}
      </Marker>
    :
      <Marker
      key={spot.id}
      position={{
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.long)
      }}
      clusterer={clusterer}
      icon={{
        url: fish,
        scaledSize: new window.google.maps.Size(30, 30)
      }}
      onClick={() => handleToggleOpen(spot.id)}
      >
      {openWindow ? (
        <InfoWindow onCloseClick={handleEditToggleClose}>
          <form className="info-window-edit-form" onSubmit={handleSubmit} >
            <label htmlFor="fishCaught" >Type of Fish</label><br/>
            <input type="text" name="fish_type" className="input-field" id="fishCaught" value={formData.fish_type} onChange={handleChange} /><br/><br/>
            <label htmlFor="date" >Date</label><br/>
            <input type="date" name="date_caught" className="input-field" id="date" value={formData.date_caught} onChange={handleChange} /><br/><br/>
            <label htmlFor="time" >Time</label><br/>
            <input type="time" name="time_caught" className="input-field" id="time" value={formData.time_caught} onChange={handleChange} /><br/><br/>
            <label htmlFor="bait">Bait/Lure</label><br/>
            <input type="text" name="bait" className="input-field" id="bait" value={formData.bait} onChange={handleChange} /><br/><br/>
            <label htmlFor="public">Do you want this spot public?</label><br/>
            <input type="checkbox" name="public" id="public" checked={isPublic} onChange={handleChange} /><br/><br/>
            <button type="submit" className="submit-button">Submit</button><br/><br/>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </InfoWindow>) : null}
      </Marker>
    );
}