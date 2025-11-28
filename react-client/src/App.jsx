// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import MovieDetails from "./pages/moviedetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Movies */}
      <Route path="/movie/:id" element={<MovieDetails type="movie" />} />

      {/* TV - base route */}
      <Route path="/tv/:id" element={<MovieDetails type="tv" />} />

      {/* TV - with season + episode */}
      <Route
        path="/tv/:id/season/:season/episode/:episode"
        element={<MovieDetails type="tv" />}
      />
    </Routes>
  );
}

export default App;
