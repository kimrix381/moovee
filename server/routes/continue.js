import express from "express";
import ContinueWatching from "../models/continuewatching.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "No token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

// SAVE PROGRESS
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      mediaId,
      type,
      progress,
      duration,
      poster,
      title,
      season,
      episode,
    } = req.body;

    const updated = await ContinueWatching.findOneAndUpdate(
      {
        userId: req.userId,
        mediaId,
      },

      {
        userId: req.userId,
        mediaId,
        type,
        progress,
        duration,
        poster,
        title,
        season,
        episode,
        updatedAt: Date.now(),
      },

      {
        new: true,
        upsert: true, // 🔥 creates if not exists
      },
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET CONTINUE LIST
router.get("/", authMiddleware, async (req, res) => {
  const list = await ContinueWatching.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .limit(10);

  res.json(list);
});

export default router;
