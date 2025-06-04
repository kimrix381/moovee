// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import MovieDetails from "./pages/moviedetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MovieDetails type="movie" />} />
      <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
    </Routes>
  );
}

export default App;
