import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div className="Navbar">
        <div className="container">
          <b>PostIDEA</b>
          <ul>
            <li>LogIn</li>
            <li>Register</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Navbar;
