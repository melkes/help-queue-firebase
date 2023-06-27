import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <React.Fragment>
    <div className="Header">
    <h1> Help Queue</h1>
    <ul className="Header">
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/sign-in">Sign In</Link>
      </li>
    </ul>
    </div>
  </React.Fragment>
  );
}

export default Header;