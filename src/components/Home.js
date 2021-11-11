import Navbar from '../components/Navbar';
import { AmplifySignOut } from '@aws-amplify/ui-react';

export default function Home({ user }) {
  return (
    <div className="home-wrapper">
      <Navbar user={user} />
      {!user ? <div className="logged-out-home">Please Login to Continue</div> :
      <h1>{user.username}</h1>}
      <footer id="footer">
        <AmplifySignOut buttonText="Logout" />
      </footer>
    </div>
  )
}