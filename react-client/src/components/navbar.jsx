import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // to check active route

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="flex gap-9 items-center p-4 bg-black text-white">
      <h1 className="text-3xl font-bold mr-80">Kimani Movies</h1>

      <Link to="/trending">
        <button
          className={`text-xl underline ${
            isActive("/trending")
              ? "decoration-white"
              : "decoration-transparent"
          }`}
        >
          Trending
        </button>
      </Link>

      <Link to="/movies">
        <button
          className={`text-xl underline ${
            isActive("/movies")
              ? "decoration-red-500"
              : "decoration-transparent"
          }`}
        >
          Movies
        </button>
      </Link>

      <Link to="/series">
        <button
          className={`text-xl underline ${
            isActive("/series")
              ? "decoration-green-700"
              : "decoration-transparent"
          }`}
        >
          Series
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
