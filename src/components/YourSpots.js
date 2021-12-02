import Navbar from "./Navbar"
import MapContainer from "./MapContainer"

export default function YourSpots({ spots, user, fetchSpots }) {
  spots = spots.filter(spot => spot.user_id === user.username)

  return (
    <div className="home-wrapper">
      <Navbar />
      <div style={{ backgroundColor: '#414141', padding: "8px", height: "3vh", lineHeight: "3vh", textAlign: "center", fontSize: "18px", color: "white" }}>
        Click a Spot to view or edit it!
      </div>
      <MapContainer spots={spots} isInSpots={true} user={user} fetchSpots={fetchSpots} />
    </div>
  )
}