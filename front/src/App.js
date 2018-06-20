import React, { Component } from "react";
import Ideas from "./Components/Ideas";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";

import "./styles/style.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <Ideas />
        <Login />
      </div>
    );
  }
}

export default App;
