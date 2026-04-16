import mongoose from "mongoose";

const continueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mediaId: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },

    season: Number,
    episode: Number,

    progress: Number,
    duration: Number,

    poster: String,
    title: String,
  },
  { timestamps: true },
);

export default mongoose.model("ContinueWatching", continueSchema);
