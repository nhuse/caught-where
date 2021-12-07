import React from 'react';
import SignoutButton from './SignoutButton';
import { NavLink } from 'react-router-dom';
import '../index.css'

export default function Navbar() {

  return (
    <nav className="navbar" style={{ display:"flex", justifyContent: "space-between", 
    alignItems: "center" }} >
      <div className="nav-div" id="home">
        <NavLink end to="/"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          activeclassname="active">
            Home
        </NavLink>
      </div>
      <div className="nav-div">
        <NavLink end to="/add_a_spot"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          id="add-a-spot"
          activeclassname="active">
            Add a Catch
        </NavLink>
      </div>
      <div className="nav-div">
        <NavLink end to="/your_spots"
          style={{ textDecoration: 'none' }}
          className="nav-link"
          id="your-spots"
          activeclassname="active">
            Your Catches
        </NavLink>
      </div>
      <SignoutButton />
    </nav>
  )
}