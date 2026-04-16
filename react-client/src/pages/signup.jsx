import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "avatar1.png",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful");

      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl w-80">
        <h2 className="text-white text-2xl mb-4 text-center">Sign Up</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-black text-white border"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded bg-black text-white border"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-black text-white border"
        />

        {/* Avatar Select */}

        <select
          name="avatar"
          onChange={handleChange}
          className="w-full p-2 mb-4 rounded bg-black text-white border"
        >
          <option value="avatar1.png">Avatar 1</option>

          <option value="avatar2.png">Avatar 2</option>

          <option value="avatar3.png">Avatar 3</option>
        </select>

        <button className="w-full bg-red-600 text-white p-2 rounded">
          Sign Up
        </button>

        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-blue-400">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
