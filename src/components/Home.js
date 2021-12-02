import Navbar from '../components/Navbar';
import MapContainer from '../components/MapContainer';

export default function Home({ user, spots, fetchSpots }) {
  spots = spots.filter(spot => spot.public)
  return (
    <div className="home-wrapper">
      <Navbar />
      <MapContainer spots={spots} isInSpots={false} user={user} fetchSpots={fetchSpots} />
    </div>
  )
}