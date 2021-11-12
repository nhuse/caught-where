import React from 'react';
import { Link } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import '../index.css'

export default function Navbar({ user }) {

  return (
    <nav className="navbar" style={{ display:"flex", justifyContent: "space-between", 
    alignItems: "center" }} >
      <Link
      to="/"
      style={{ textDecoration: 'none', marginLeft: '25px' }}
      id="home-btn">
        <button className="nav-btn" >
          Home
        </button>
      </Link>
      {user ?
        <h2>Welcome {user.username}!</h2>
        :
        null
      }
      <Link
      to="/your_spots"
      style={{ textDecoration: 'none' }}
      id="spots-btn">
        <button className="nav-btn" >
          Your Spots
        </button>
      </Link>
      <div id="logout-btn" style={{ height: "35px", display: "flex", 
      alignItems: "center", justifyContent: "center", marginRight: "25px" }}>
        <AmplifySignOut buttonText="Logout" />
      </div>
    </nav>
  )
}