import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

const router = express.Router();

/* AUTH MIDDLEWARE */

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

/* MULTER CONFIG */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* GET PROFILE */

router.get("/", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  res.json(user);
});

/* UPDATE PROFILE */

router.put(
  "/update",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const { username } = req.body;

      const updateData = {
        username,
      };

      if (req.file) {
        updateData.avatar = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
        new: true,
      }).select("-password");

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({
        message: "Update failed",
      });
    }
  },
);

export default router;
