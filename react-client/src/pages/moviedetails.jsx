import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Futuristic from "../assets/Futuristic.mp4";
import { Link } from "react-router-dom";

const API_KEY = "c4370729220155d050944d6b19d83659";

const MovieDetails = ({ type }) => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [embedUrl, setEmbedUrl] = useState("");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [seasonsCount, setSeasonsCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false); // toggle visibility
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("popular");

  const fetchEpisodes = async (seasonNumber) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const data = await res.json();
      setEpisodes(data.episodes || []);
      if (episode > (data.episodes?.length || 1)) setEpisode(1);
    } catch (err) {
      console.error("Failed to fetch episodes", err);
    }
  };

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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=external_ids`
        );
        const data = await res.json();
        setDetails(data);

        if (type === "tv") {
          setSeasonsCount(data.seasons?.length || 1);
          if (season > data.seasons?.length) setSeason(1);
          await fetchEpisodes(season);
        }

        const imdbId = data.external_ids?.imdb_id;
        if (imdbId) {
          const url =
            type === "movie"
              ? `https://vidfast.pro/movie/${imdbId}?autoPlay=true`
              : `https://vidfast.pro/tv/${imdbId}/${season}/${episode}?autoPlay=true`;
          setEmbedUrl(url);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch movie/series details:", err);
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchDetails, 6000); // Optional delay
    return () => clearTimeout(timer);
  }, [id, type, season, episode]);

  useEffect(() => {
    if (type === "tv") {
      fetchEpisodes(season);
    }
  }, [season]);

  if (loading || !details) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <video
          title="Loading..."
          className="absolute top-0 left-0 w-[400px] h-full md:w-full md:h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src={Futuristic}
        />
      </div>
    );
  }

  return (
    <div className="p-4 w-full text-white bg-black ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs md:text-3xl font-bold mb-2">
          {details.title || details.name}
        </h2>
        <Link
          to={`/`}
          className="p-2 font-bold rounded-2xl md:px-6 animated-border text-center md:w-[164px] bg-white text-black"
        >
          Home
        </Link>
        <div>
          {" "}
          <i
            id="search"
            className="bx bx-search-alt text-3xl cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          ></i>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        {showSearch && (
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 border rounded text-white border-white  w-full"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Go
            </button>
          </form>
        )}
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
      </div>
      <div className="my-6">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="500"
            allowFullScreen
            className="rounded"
            title="Video Player"
          ></iframe>
        ) : (
          <p className="text-red-600">No video available.</p>
        )}
      </div>

      <p className="text-gray-400 italic mb-2">{details.tagline}</p>

      {type === "tv" && (
        <div className="mb-4 flex-col md:flex items-center gap-6">
          <label>
            Season:{" "}
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="border p-1 rounded border-white text-white bg-black"
            >
              {[...Array(seasonsCount).keys()].map((s) => (
                <option key={s + 1} value={s + 1}>
                  {s + 1}
                </option>
              ))}
            </select>
          </label>

          <label>
            Episode:{" "}
            <select
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="border p-1 rounded border-white text-white bg-black"
            >
              {episodes.map((ep) => (
                <option key={ep.episode_number} value={ep.episode_number}>
                  {ep.episode_number} - {ep.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div className="md:flex  items-start gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="w-[400px] rounded mb-4 h-[320px]"
        />
        <div className="md:flex flex-col ">
          <p className="mb-2">
            <strong>Overview:</strong> {details.overview}
          </p>

          <p className="mb-2">
            <strong>Genres:</strong>{" "}
            {details.genres?.map((g) => g.name).join(", ") || "N/A"}
          </p>

          <p className="mb-2">
            <strong>Rating:</strong> {details.vote_average} ⭐
          </p>

          <p className="mb-2">
            <strong>Release Date:</strong>{" "}
            {details.release_date || details.first_air_date}
          </p>

          <p className="mb-2">
            <strong>Status:</strong> {details.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
