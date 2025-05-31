import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MoviePlayer from "../components/movieplayer.jsx";

const API_KEY = "c4370729220155d050944d6b19d83659";

const MovieDetails = ({ type }) => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [embedUrl, setEmbedUrl] = useState("");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [seasonsCount, setSeasonsCount] = useState(1);

  // Fetch main details + external IDs
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=external_ids`
    )
      .then((res) => res.json())
      .then((data) => {
        setDetails(data);

        if (type === "tv") {
          setSeasonsCount(data.seasons?.length || 1);
          if (season > data.seasons?.length) setSeason(1);
          fetchEpisodes(season);
        }

        const imdbId = data.external_ids?.imdb_id;
        if (imdbId) {
          if (type === "movie") {
            setEmbedUrl(`https://vidsrc.xyz/embed/movie/${imdbId}`);
          } else if (type === "tv") {
            setEmbedUrl(
              `https://vidsrc.xyz/embed/tv/${imdbId}/${season}-${episode}`
            );
          }
        }
      });
  }, [id, type]);

  // Fetch episodes and update list
  const fetchEpisodes = (seasonNumber) => {
    fetch(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data.episodes || []);
        if (episode > (data.episodes?.length || 1)) setEpisode(1);
      });
  };

  // Update embedUrl and fetch episodes when season or episode changes
  useEffect(() => {
    if (details && details.external_ids?.imdb_id && type === "tv") {
      setEmbedUrl(
        `https://vidsrc.xyz/embed/tv/${details.external_ids.imdb_id}/${season}-${episode}`
      );
    }
    if (type === "tv") {
      fetchEpisodes(season);
    }
  }, [season, episode]);

  if (!details) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">
        {details.title || details.name}
      </h2>
      {/* Embed VidSrc Player */}
      <div className="mt-8">
        {embedUrl ? (
          <MoviePlayer embedUrl={embedUrl} />
        ) : (
          <p className="text-red-600">No video available.</p>
        )}
      </div>

      <p className="text-gray-600 mb-4 italic">{details.tagline}</p>
      {type === "tv" && (
        <div className="mb-4 flex items-center space-x-6">
          <label>
            Season:{" "}
            <select
              value={season}
              onChange={(e) => setSeason(Number(e.target.value))}
              className="border p-1 rounded"
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
              className="border p-1 rounded"
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
      <img
        src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
        alt={details.title || details.name}
        className="w-64 rounded mb-4"
      />

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
  );
};

export default MovieDetails;
