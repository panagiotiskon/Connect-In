import React from "react";
import Board from "./board";
import logo from "file:///home/stelios/Desktop/Project_tedi/Pepe-In/frontend/Screenshot_from_2024-07-16_16-23-12__1_-removebg-preview.png";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="logo-container d-flex align-items-center">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Board />
      </div>
    </div>
  );
};

export default HomePage;
