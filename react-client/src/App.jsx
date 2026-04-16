import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home.jsx";
import MovieDetails from "./pages/moviedetails.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import EditProfile from "./pages/editprofile.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Listen for login/logout changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const isLoggedIn = token && token !== "undefined" && token !== "null";

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
      />

      {/* SIGNUP */}
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/profile/edit"
        element={isLoggedIn ? <EditProfile /> : <Navigate to="/" />}
      />

      {/* HOME */}
      <Route
        path="/home"
        element={isLoggedIn ? <Home /> : <Navigate to="/" />}
      />

      {/* MOVIES */}
      <Route
        path="/movie/:id"
        element={
          isLoggedIn ? <MovieDetails type="movie" /> : <Navigate to="/" />
        }
      />

      {/* TV BASE */}
      <Route
        path="/tv/:id"
        element={isLoggedIn ? <MovieDetails type="tv" /> : <Navigate to="/" />}
      />

      {/* 🔥 THIS IS THE FIX */}
      <Route
        path="/tv/:id/season/:season/episode/:episode"
        element={isLoggedIn ? <MovieDetails type="tv" /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
