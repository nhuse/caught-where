import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'

export default function Navbar({ user }) {

  return (
    <nav className="navbar" style={{ display:"flex", justifyContent: "space-between", alignItems: "center" }} >
      <Link
      to="/"
      style={{ textDecoration: 'none', width: "300px" }}
      id="home-btn">
        <button className="nav-btn" >
          Home
        </button>
      </Link>
      {user ?
        <h2>Welcome {user.username}</h2>
        :
        null
      }
      <Link
      to="/your_spots"
      style={{ textDecoration: 'none', width: "300px" }}
      id="spots-btn">
        <button className="nav-btn" >
          Your Spots
        </button>
      </Link>
    </nav>
  )
}