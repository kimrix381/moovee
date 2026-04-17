import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.js";
import continueRoutes from "./routes/continue.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
/* 🔥 CORS FIX */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://kimanimovies.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/continue", continueRoutes);
app.use("/api/profile", profileRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
