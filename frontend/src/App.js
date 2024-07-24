import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/home-page";
import SignUpComponent from "./components/sign-up-component";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/signup" element={<SignUpComponent />} />{" "}
            <Route path="/" element={<HomePage />} /> {/* Render HomePage */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
