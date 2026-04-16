import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Futuristic from "../assets/Futuristic.mp4";

const API_KEY = "c4370729220155d050944d6b19d83659";

const MovieDetails = ({ type }) => {
  const { id, season: urlSeason, episode: urlEpisode } = useParams();

  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [embedUrl, setEmbedUrl] = useState("");

  const [season, setSeason] = useState(urlSeason ? Number(urlSeason) : 1);

  const [episode, setEpisode] = useState(urlEpisode ? Number(urlEpisode) : 1);

  const [episodes, setEpisodes] = useState([]);

  const [seasonsCount, setSeasonsCount] = useState(1);

  const [loading, setLoading] = useState(true);

  /* ------------------------------
     SAVE CONTINUE WATCHING
  ------------------------------ */

  const saveContinueWatching = async (movieData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await fetch("https://moovee-6zqk.onrender.com/api/continue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          mediaId: movieData.id,

          type: type,

          season: type === "tv" ? season : null,

          episode: type === "tv" ? episode : null,

          poster: movieData.poster_path,

          title: movieData.title || movieData.name,
        }),
      });
    } catch (err) {
      console.error("Continue save error:", err);
    }
  };

  /* ------------------------------
     SYNC URL → STATE
  ------------------------------ */

  useEffect(() => {
    if (urlSeason) setSeason(Number(urlSeason));

    if (urlEpisode) setEpisode(Number(urlEpisode));
  }, [urlSeason, urlEpisode]);

  /* ------------------------------
     FETCH EPISODES
  ------------------------------ */

  const fetchEpisodes = async (seasonNumber) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`,
      );

      const data = await res.json();

      setEpisodes(data.episodes || []);

      if (episode > (data.episodes?.length || 1)) {
        setEpisode(1);

        navigate(`/tv/${id}/season/${seasonNumber}/episode/1`);
      }
    } catch (err) {
      console.error("Episode fetch error:", err);
    }
  };

  /* ------------------------------
     MAIN FETCH
  ------------------------------ */

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`,
        );

        const data = await res.json();

        setDetails(data);

        // 🔥 SAVE PROGRESS
        saveContinueWatching(data);

        if (type === "tv") {
          const seasons = data.seasons?.length || 1;

          setSeasonsCount(seasons);

          if (season > seasons) {
            setSeason(1);

            navigate(`/tv/${id}/season/1/episode/1`);
          }

          await fetchEpisodes(season);

          const url = `https://www.vidking.net/embed/tv/${data.id}/${season}/${episode}?autoPlay=true`;

          setEmbedUrl(url);
        } else {
          const url = `https://www.vidking.net/embed/movie/${data.id}?autoPlay=true`;

          setEmbedUrl(url);
        }

        /* ⏳ KEEP LOADING SCREEN */

        setTimeout(() => {
          setLoading(false);
        }, 5000);
      } catch (err) {
        console.error("Fetch details failed:", err);

        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, type, season, episode]);

  /* FETCH EPISODES WHEN SEASON CHANGES */

  useEffect(() => {
    if (type === "tv") {
      fetchEpisodes(season);
    }
  }, [season]);

  /* ------------------------------
     LOADING SCREEN
  ------------------------------ */

  if (loading || !details) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={Futuristic} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center"></div>
      </div>
    );
  }

  /* ------------------------------
     MAIN UI
  ------------------------------ */

  return (
    <div className="p-4 w-full text-white bg-black">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs md:text-3xl font-bold">
          {details.title || details.name}
        </h2>

        <Link
          to="/home"
          className="p-2 font-bold rounded-2xl bg-white text-black"
        >
          Home
        </Link>
      </div>

      {/* VIDEO PLAYER */}

      <div className="my-6">
        <iframe
          src={embedUrl}
          width="100%"
          height="500"
          allowFullScreen
          className="rounded"
          title="Video Player"
        />
      </div>

      {/* SEASON + EPISODE */}

      {type === "tv" && (
        <div className="mb-4 flex items-center gap-6">
          <label>
            Season:
            <select
              value={season}
              onChange={(e) => {
                const s = Number(e.target.value);

                setSeason(s);

                navigate(`/tv/${id}/season/${s}/episode/1`);
              }}
              className="border p-1 rounded border-white bg-black ml-2"
            >
              {[...Array(seasonsCount).keys()].map((s) => (
                <option key={s + 1} value={s + 1}>
                  {s + 1}
                </option>
              ))}
            </select>
          </label>

          <label>
            Episode:
            <select
              value={episode}
              onChange={(e) => {
                const ep = Number(e.target.value);

                setEpisode(ep);

                navigate(`/tv/${id}/season/${season}/episode/${ep}`);
              }}
              className="border p-1 rounded border-white bg-black ml-2"
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

      {/* DETAILS */}

      <div className="md:flex items-start gap-6">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title || details.name}
          className="w-[400px] rounded mb-4"
        />

        <div>
          <p className="mb-2">
            <strong>Overview:</strong>

            {details.overview}
          </p>

          <p className="mb-2">
            <strong>Genres:</strong>{" "}
            {details.genres?.map((g) => g.name).join(", ")}
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
