import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import neon from "../assets/neon.mp4";

const API_KEY = "c4370729220155d050944d6b19d83659";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("popular");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie"); // 'movie' or 'tv'
  const [trendingItems, setTrendingItems] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);

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

  useEffect(() => {
    // Trending
    fetch(
      `https://api.themoviedb.org/3/trending/${type}/week?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setTrendingItems(data.results));

    // Top Rated
    fetch(`https://api.themoviedb.org/3/${type}/top_rated?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setPopularItems(data.results));

    // Now Playing (Latest) or On The Air for TV
    const latestUrl =
      type === "movie"
        ? `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        : `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`;

    fetch(latestUrl)
      .then((res) => res.json())
      .then((data) => setLatestItems(data.results));
  }, [type]);

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
    <div className="p-4 text-amber-50 bg-black ">
      <nav className="flex-col md:flex-row md:flex gap-9 md:justify-between mb-6 text-center md:mb-0">
        <div
          id="top"
          className="bouncing-letters text-xs md:text-xl  font-bold space-y-1"
        >
          <p className="text-sky-500">
            {"kimani".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </p>
          <p className="text-pink-500">
            {"Movies".split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </p>
        </div>
        <div className=" ">
          <a
            href="#trending"
            className="underline decoration-white   rounded-2xl bg-white text-black text-sm p-2 mr-2 md:text-xl md:mr-6 md:px-3 md:py-0.5"
          >
            Trending
          </a>
          <a
            href="#latest"
            className="underline decoration-red-500  rounded-2xl bg-red-500 text-black text-sm p-2 mr-2 md:text-xl md:mr-6 md:px-3 md:py-0.5"
          >
            Latest
          </a>
          <a
            href="#toprated"
            className="underline decoration-green-700  rounded-2xl bg-green-700 text-sm p-2 mr-2 md:text-xl md:mr-6 md:px-3 md:py-0.5"
          >
            Top Rated
          </a>
        </div>
        <div className="ml-30"></div>
      </nav>

      <div className="relative md:h-screen md:w-full overflow-hidden rounded-2xl">
        <video
          className="absolute top-0 left-0 w-full h-[400px] md:h-[700px] object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          src={neon}
          type="video/mp4"
        />

        <div className="relative z-10 flex items-center justify-center h-full text-black">
          <div className="text-center justify-center w-full p-90 md:p-40 sm:p-20 ">
            {/* <h1 className="text-4xl font-bold mb-30 md:mb-50 text-white">
              Welcome to Kimani Movies
            </h1> */}
            <h1 className="text-xl mb-10 text-amber-50">
              Choose between the two below
            </h1>
            <div className="mb-4 flex gap-4 text-center justify-center ">
              <button
                onClick={() => handleTypeChange("movie")}
                className={` px-4 py-2 rounded ${
                  type === "movie"
                    ? "btn-grad text-white"
                    : "bg-gray-200  px-[45px] py-[0px] h-10 mt-4"
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleTypeChange("tv")}
                className={`px-4 py-2 rounded  ${
                  type === "tv"
                    ? "btn-grad text-white"
                    : "bg-gray-200 px-[45px] py-[0px] h-10 mt-4"
                }`}
              >
                Series
              </button>
            </div>

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
                className="p-2 border border-red-600 rounded-4xl w-full text-white bg-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={showComponent}
                type="submit"
                className="bg-linear-to-t from-red-950 to-red-500 text-white px-4 py-2 rounded "
              >
                Search
              </button>
            </form>

            <div ref={hiddenRef} className="hidden text-white">
              <h1 className=" text-3xl">Scroll down</h1>
              <i className="bx  bx-chevron-down text-8xl"></i>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-5" />
      </div>

      {/* Search Results */}
      {searchTerm !== "popular" && (
        <div className="mt-16">
          <h2 className="text-5xl font-bold mb-10">Search Results</h2>
          {items.length === 0 ? (
            <p className="text-xl text-red-400">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={`/${type}/${item.id}`}
                  className="block border rounded shadow hover:scale-105 transition h-[200px] w-[150px] md:h-[350px] md:w-[300px] mb-10"
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
          )}
        </div>
      )}

      {/* Trending */}
      <div id="trending" className="mt-16">
        <h2 className="text-5xl font-bold mb-10">Trending</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trendingItems.map((item) => (
            <Link
              key={item.id}
              to={`/${type}/${item.id}`}
              className="block border rounded shadow hover:scale-105 transition h-[200px] w-[150px] md:h-[350px] md:w-[300px] mb-10"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                className="w-full h-full "
              />
              <p className="text-sm mt-2 text-center">
                {item.title || item.name}
              </p>
            </Link>
          ))}
        </div>

        <a
          href="#top"
          className="text-2xl shake-button fixed bottom-9 right-6 bg-blue-500 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-600 z-50"
        >
          <i href="#top" class="bx  bx-chevrons-up"></i>
        </a>
      </div>

      {/* Latest */}
      <div id="latest" className="mt-16">
        <h2 className="text-5xl font-bold mb-10">Latest</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
          {latestItems.map((item) => (
            <Link
              key={item.id}
              to={`/${type}/${item.id}`}
              className="block border rounded shadow hover:scale-105 transition h-[200px] w-[150px] md:h-[350px] md:w-[300px] mb-10"
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

      {/* Top Rated */}
      <div id="toprated" className="mt-16">
        <h2 className="text-5xl font-bold mb-10">Top Rated</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {popularItems.map((item) => (
            <Link
              key={item.id}
              to={`/${type}/${item.id}`}
              className="block border rounded shadow hover:scale-105 transition h-[200px] w-[150px] md:h-[350px] md:w-[300px] mb-10"
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
    </div>
  );
};

export default Home;
