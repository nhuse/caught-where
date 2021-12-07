import { Auth, Hub } from 'aws-amplify';

export default function SignoutButton() {
  const handleSignOutButtonClick = async () => {
    try {
      await Auth.signOut();
      Hub.dispatch('UI Auth', {   // channel must be 'UI Auth'
          event: 'AuthStateChange',    // event must be 'AuthStateChange'
          message: 'signedout'    // message must be 'signedout'
      });
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <button id="logout-btn" className="nav-div" onClick={handleSignOutButtonClick}>Sign Out</button>
  )
}