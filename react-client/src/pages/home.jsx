import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import neon from "../assets/neon.mp4";
import GalaxyRain from "../components/galaxyrain";
import CyberGridFloor from "../components/cybergridfloor";
import CyberGrid3D from "../components/cybergrid3d";
import CyberSystem from "../components/cybersystem";

const API_KEY = "c4370729220155d050944d6b19d83659";

const Home = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [continueList, setContinueList] = useState([]);

  const [trendingItems, setTrendingItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();

      setUser(data);
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim().length < 3) {
        setItems([]);
        return;
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${query}`,
      );

      const data = await res.json();

      setItems(data.results || []);
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  useEffect(() => {
    const fetchContinue = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/continue", {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();

        setContinueList(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContinue();
  }, []);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setTrendingItems(data.results));

    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setPopularItems(data.results));

    fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setLatestItems(data.results));
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND IMAGE */}
      <div
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://mir-s3-cdn-cf.behance.net/project_modules/1400/17af9a53451651.59356b7a6e040.jpg')",
        }}
      />

      <div id="top1"></div>

      {/* NAV */}
      <nav className="flex justify-between items-center mb-6 relative z-10">
        <h1 className="font-bold text-xl">Kimani Movies</h1>

        {user && (
          <div className="flex items-center gap-3">
            <img
              src={`/avatars/${user.avatar}`}
              className="w-8 h-8 rounded-full"
            />

            <span>{user.username}</span>

            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-blue-600 px-3 py-1 rounded"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <div className="relative md:h-screen overflow-hidden rounded-2xl z-10">
        {/* <video
            className="absolute top-0 left-0 w-full h-[400px] md:h-[700px] object-cover"
            autoPlay
            loop
            muted
            playsInline
            src={neon}
          /> */}

        <div className="relative z-10 flex justify-center items-center h-full">
          <div className="text-center w-full md:p-40">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies or series..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 border border-red-600 rounded-4xl w-full text-white bg-black"
              />

              {items.length > 0 && (
                <div className="absolute top-14 w-full bg-black border border-red-600 rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
                  {items
                    .filter(
                      (item) =>
                        item.media_type === "movie" || item.media_type === "tv",
                    )
                    .slice(0, 6)
                    .map((item) => (
                      <Link
                        key={item.id}
                        to={
                          item.media_type === "tv"
                            ? `/tv/${item.id}`
                            : `/movie/${item.id}`
                        }
                        onClick={() => setQuery("")}
                        className="flex items-center gap-3 p-2 hover:bg-gray-800"
                      >
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                              : "/no-image.png"
                          }
                          alt={item.title || item.name}
                          className="w-10 h-14 rounded"
                        />
                        <span>{item.title || item.name}</span>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTINUE WATCHING */}
      {continueList.length > 0 && (
        <div className="mt-16 relative z-10">
          <h2 className="text-5xl font-bold mb-10">Continue Watching</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {continueList.map((item) => (
              <Link
                key={item._id}
                to={
                  item.type === "tv"
                    ? `/tv/${item.mediaId}/season/${item.season}/episode/${item.episode}`
                    : `/movie/${item.mediaId}`
                }
                className="block border rounded shadow hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                  alt={item.title}
                />

                <p className="text-sm mt-2 text-center">
                  {item.title}

                  {item.type === "tv" && (
                    <span className="block text-xs text-gray-400">
                      Season {item.season} • Episode {item.episode}
                    </span>
                  )}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* TRENDING */}
      <div className="mt-16 relative z-10">
        <h2 className="text-5xl font-bold mb-10">Trending</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trendingItems
            .filter(
              (item) => item.media_type === "movie" || item.media_type === "tv",
            )
            .map((item) => (
              <Link
                key={item.id}
                to={
                  item.media_type === "tv"
                    ? `/tv/${item.id}`
                    : `/movie/${item.id}`
                }
                className="block border rounded shadow hover:scale-105 transition"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                />
                <p className="text-sm mt-2 text-center">
                  {item.title || item.name}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
