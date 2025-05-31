import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link
      to={`/movie/${movie.imdbID}`}
      className="border p-2 rounded shadow hover:shadow-lg"
    >
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full h-64 object-cover mb-2"
      />
      <h2 className="font-semibold">{movie.Title}</h2>
      <p className="text-sm text-gray-600">{movie.Year}</p>
    </Link>
  );
}

export default MovieCard;
