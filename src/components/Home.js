import Navbar from '../components/Navbar';
import MapContainer from '../components/MapContainer';

export default function Home({ user }) {
  return (
    <div className="home-wrapper">
      <Navbar user={user} />
      <MapContainer />
    </div>
  )
}