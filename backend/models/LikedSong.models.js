import mongoose from "mongoose";
const { Schema } = mongoose;
const UserLikedSongSchema = new Schema({
  uid: {
    type: String,
    ref: "User",
    required: true,
  },
  songIds: [
    {
      type: String,
      ref: "Song",
      required: true,
    },
  ],
});
// UserLikedSongSchema.index({ uid: 1 }, { unique: true });
export const UserLikedSong = mongoose.model(
  "UserLikedSong",
  UserLikedSongSchema
);
