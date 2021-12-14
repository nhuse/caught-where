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
    <div id='logout-txt' onClick={handleSignOutButtonClick}>Sign Out</div>
  )
}