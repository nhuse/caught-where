import Navbar from '../components/Navbar';
import MapContainer from '../components/MapContainer';

export default function Home({ user, spots }) {
  return (
    <div className="home-wrapper">
      <Navbar user={user} />
      <MapContainer spots={spots} />
    </div>
  )
}