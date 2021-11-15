import React from 'react';
import { NavLink } from 'react-router-dom';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import '../index.css'

export default function Navbar({ user }) {

  return (
    <nav className="navbar" style={{ display:"flex", justifyContent: "space-between", 
    alignItems: "center" }} >
      <div className="nav-div" style={{ marginLeft: '25px', padding: "0 20px", display: "flex", alignItems: "center" }}>
        <NavLink end to="/"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          activeclassname="active">
            Home
        </NavLink>
      </div>
      <div className="nav-div" style={{ marginLeft: '25px', padding: "0 20px", display: "flex", alignItems: "center" }}>
        <NavLink end to="/add_a_spot"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          activeclassname="active">
            Add a Catch
        </NavLink>
      </div>
      <div className="nav-div" style={{ marginLeft: '25px', padding: "0 20px", display: "flex", alignItems: "center" }}>
        <NavLink end to="/your_spots"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          activeclassname="active">
            Your Catches
        </NavLink>
      </div>
      <div id="logout-btn" style={{ height: "35px", display: "flex", 
      alignItems: "center", justifyContent: "center", marginRight: "25px" }}>
        <AmplifySignOut buttonText="Logout" />
      </div>
    </nav>
  )
}