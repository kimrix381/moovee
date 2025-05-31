import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VideoBackground from "../components/videobackground";
import neon from "../assets/neon.mp4";

const API_KEY = "c4370729220155d050944d6b19d83659";
import { useRef } from "react";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("popular");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie"); // 'movie' or 'tv'

  const fetchItems = async () => {
    const url =
      searchTerm === "popular"
        ? `https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}`
        : `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&query=${searchTerm}`;

    const res = await fetch(url);
    const data = await res.json();
    setItems(data.results || []);
  };

  useEffect(() => {
    fetchItems();
  }, [searchTerm, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setSearchTerm("popular");
    setQuery("");
  };

  const hiddenRef = useRef();

  const showComponent = () => {
    hiddenRef.current.classList.remove("hidden");
  };

  return (
    <div className="p-4 text-amber-50 bg-black">
      <nav className="flex gap-9 ">
        <h1 className="text-3xl font-bold mb-4 mr-50">
          Movie & Series Explorer
        </h1>
        <button>Trending </button>
        <button>movies </button>
        <button>series </button>
      </nav>

      {/* <VideoBackground /> */}
      <div className="relative h-screen w-full overflow-hidden mb-10">
        {/* Background Video */}
        <video
          title="Background Video"
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          src={neon}
          type="video/mp4"
        />
        Foreground Content
        <div className="relative z-10 flex items-center justify-center h-full text-black">
          <div className="text-center justify-center">
            <h1 className="text-4xl font-bold mb-50 text-white">
              Welcome to My Movie App
            </h1>
            <h1 className="text-xl mb-10 text-amber-50">
              Choose between the two below
            </h1>
            <div className="mb-4 flex gap-4">
              <button
                onClick={() => handleTypeChange("movie")}
                className={` px-4 py-2 rounded ${
                  type === "movie" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleTypeChange("tv")}
                className={`px-4 py-2 rounded ${
                  type === "tv" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Series
              </button>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mb-6 flex gap-2 text-amber-50"
            >
              <input
                id="search"
                type="text"
                placeholder={`Search ${
                  type === "movie" ? "movies" : "series"
                }...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 border rounded w-full text-amber-50"
              />
              <button
                onClick={showComponent}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded "
              >
                Search
              </button>
            </form>
            <div ref={hiddenRef} className="hidden text-white">
              <h1 className=" text-3xl">Scroll down</h1>
              <i class="bx  bx-chevron-down text-8xl"></i>
            </div>
          </div>
        </div>
        {/* Optional overlay for better text visibility */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-5" />
      </div>

      {/* Items Grid */}
      <h2 className="text-5xl font-bold mb-10">Trending</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/${type === "movie" ? "movie" : "series"}/${item.id}`}
            className="block border rounded shadow hover:scale-105 transition h-[350px] mb-10 w-[300px]"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
              className="w-full h-full"
            />
            <p className="text-sm mt-2 text-center">
              {item.title || item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
