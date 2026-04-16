import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MatrixRain from "../components/matrixrain.jsx";
import GlitchScreen from "../components/glitchscreen.jsx";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [glitch, setGlitch] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🧠 typing effect
  const typeText = (text, cb) => {
    let i = 0;
    setStatus("");

    const interval = setInterval(() => {
      setStatus(text.slice(0, i));
      i++;

      if (i > text.length) {
        clearInterval(interval);
        setTimeout(cb, 500);
      }
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    typeText("AUTHENTICATING...", async () => {
      try {
        const res = await fetch(
          "https://moovee-6zqk.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          },
        );

        const data = await res.json();

        if (!res.ok || !data.token) {
          setStatus("ACCESS DENIED");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));
        setStatus("ACCESS GRANTED");
        setShowGlitch(true);

        setTimeout(() => {
          window.location.href = "/home";
        }, 1000);
      } catch (err) {
        console.error(err);
        setStatus("SYSTEM ERROR");
        setLoading(false);
      }
    });
  };
  <GlitchScreen show={showGlitch} />;
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Matrix Background */}
      <MatrixRain />

      {/* GLITCH OVERLAY */}
      {glitch && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-pulse">
          <h1 className="text-green-400 text-4xl font-bold glitch">
            ACCESS GRANTED
          </h1>
        </div>
      )}

      {/* LOGIN CARD */}
      <div className="relative z-10 bg-black/70 backdrop-blur-md p-8 rounded-xl w-80 border border-green-500">
        {/* STATUS TEXT */}
        {status && (
          <div className="text-green-400 text-center mb-4 font-mono text-sm">
            {status}
            <span className="animate-pulse">_</span>
          </div>
        )}

        <h2 className="text-green-400 text-2xl mb-4 text-center">LOGIN</h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-black text-white border border-green-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-black text-white border border-green-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-black p-2 rounded font-bold hover:bg-green-500 transition"
        >
          LOGIN
        </button>

        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
