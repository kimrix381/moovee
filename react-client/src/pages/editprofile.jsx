import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const [avatar, setAvatar] = useState(null);

  const [preview, setPreview] = useState(null);

  /* LOAD USER */

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("https://moovee-6zqk.onrender.com/api/profile", {
        headers: {
          Authorization: token,
        },
      });

      const data = await res.json();

      setUsername(data.username);

      if (data.avatar) {
        setPreview(`https://moovee-6zqk.onrender.com/uploads/${data.avatar}`);
      }
    };

    fetchUser();
  }, []);

  /* HANDLE FILE */

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setAvatar(file);

    setPreview(URL.createObjectURL(file));
  };

  /* SAVE */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("username", username);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    const res = await fetch(
      "https://moovee-6zqk.onrender.com/api/profile/update",
      {
        method: "PUT",
        headers: {
          Authorization: token,
        },
        body: formData,
      },
    );

    if (res.ok) {
      alert("Profile updated");

      navigate("/home");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl w-80 text-white"
      >
        <h2 className="text-2xl mb-4 text-center">Edit Profile</h2>

        {/* AVATAR */}

        {preview && (
          <img src={preview} className="w-24 h-24 rounded-full mx-auto mb-4" />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
        />

        {/* USERNAME */}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-black border"
        />

        <button className="w-full bg-red-600 p-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
