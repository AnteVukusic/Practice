import React, { Component } from "react";
import Ideas from "./Components/Ideas";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        MyApp
        <Ideas test="HelloWorld" />
      </div>
    );
  }
}

export default App;
