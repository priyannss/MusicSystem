import { UserLikedSong } from "../models/LikedSong.models.js";
import { User } from "../models/User.models.js";
import { Playlist } from "../models/Playlist.models.js";
import { RecentlyPlayed } from "../models/RecentlyPlayed.models.js";
import { Song } from "../models/Song.models.js";
import { Recommendation } from "../models/Recommendation.models.js";
import getSpotifyId from "../services/spotifySongId.js";
import { getSongFromId } from "../services/getSongFromId.js";
import mongoose from "mongoose";

//total two incomplete and ten complete

//one -> incomplete
export const getRecommendations = async (req, res) => {};

export const getRecentlyPlayed = async (req, res) => {
  try {
    const { uid } = req.body;

    const existUser = await RecentlyPlayed.findOne({ uid });
    if (
      !existUser ||
      !Array.isArray(existUser.songIds) ||
      existUser.songIds.length === 0
    ) {
      return res.status(200).json({ recentlyPlayed: [] });
    }
    const songs = await Song.find({
      spotifyId: { $in: existUser.songIds },
    }).select("-__v");

    // Order the songs array to match the order of song IDs saved
    const orderedSongs = existUser.songIds
      .map(id => songs.find(song => song.spotifyId === id))
      .filter(song => song);
      
    res.status(200).json({
      recentlyPlayed: orderedSongs,
    });
  } catch (error) {
    console.error("Error fetching recently played songs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const saveRecentlyPlayed = async (req, res) => {
  try {
    const { uid, songId } = req.body;
    if (!uid || !songId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Song ID are required" });
    }

    let recentlyPlayed = await RecentlyPlayed.findOne({ uid });

    if (!recentlyPlayed) {
      // If no record exists, create a new one
      recentlyPlayed = new RecentlyPlayed({ uid, songIds: [songId] });
    } else {
      // Remove duplicate entry if song already exists
      recentlyPlayed.songIds = recentlyPlayed.songIds.filter(
        (s) => s !== songId
      );
      // Add new song at the beginning
      recentlyPlayed.songIds.unshift(songId);

      if (recentlyPlayed.songIds.length > 25) {
        recentlyPlayed.songIds.pop(); // Remove the oldest one
      }
    }

    await recentlyPlayed.save();

    res
      .status(200)
      .json({ success: true, message: "Song added to recently played" });
  } catch (error) {
    console.error("Error saving recently played song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getPlaylists = async (req, res) => {
  const userID = req.user._id;
  const playlists = await Playlist.find({ user: userID });
  res.status(200).json({ playlists });
};

export const getLikedSongs = async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const userLikedSongs = await UserLikedSong.findOne({ uid });
    if (
      !userLikedSongs ||
      !Array.isArray(userLikedSongs.songIds) ||
      userLikedSongs.songIds.length === 0
    ) {
      return res.status(200).json({ likedSongs: [] });
    }

    // Query Song model by Spotify IDs in userLikedSongs.songIds
    const likedSongs = await Song.find({
      spotifyId: { $in: userLikedSongs.songIds },
    }).select("-__v");

    res.status(200).json({
      likedSongs: likedSongs || [],
    });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  const user = req.user;
  res.status(200).json({ user });
};

export const getSelectedSong = async (req, res) => {
  const { songId } = req.body;
  const song = await getSongFromId(songId);
  res.status(200).json(song)
};

export const addSongs = async (req, res) => {
  try {
    const songs = req.body; // Expecting an array of { title, artist }

    if (!Array.isArray(songs) || songs.length === 0) {
      return res.status(400).json({ message: "Songs array is required" });
    }

    const addedSongs = [];

    for (const { title, artist } of songs) {
      if (!title || !artist) continue; // Skip invalid entries

      // Fetch song details from Spotify
      const songData = await getSpotifyId(title, artist);
      if (!songData) continue; // Skip if song not found

      const { spotifyId, duration, album, coverImage } = songData;

      // Check if the song already exists
      const existingSong = await Song.findOne({ spotifyId });
      if (existingSong) continue; // Skip duplicates

      // Create and save the new song
      const newSong = new Song({
        title,
        artist,
        spotifyId,
        duration,
        album,
        coverImage,
      });
      await newSong.save();
      addedSongs.push(newSong);
    }

    if (addedSongs.length === 0) {
      return res.status(400).json({ message: "No new songs were added" });
    }

    res
      .status(201)
      .json({ message: "Songs added successfully", songs: addedSongs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSongFromBackend = async (req, res) => {
  try {
    const songs = await Song.aggregate([{ $sample: { size: 10 } }]);
    res.status(200).json({ songs });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, name, uid } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    const newUser = await User.create({
      email,
      name,
      uid,
    });
    await newUser.save();
  }
  // const token = user.getToken();
  // res.cookie({token})
  res.status(200).json({ message: "Logged in" });
};

export const getDatabaseUser = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const setLikedSongs = async (req, res) => {
  try {
    const { uid, songId } = req.body;

    if (!uid || !songId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Song ID are required" });
    }

    let userLiked = await UserLikedSong.findOne({ uid });

    if (userLiked) {
      // Prevent duplicate song entries
      if (!userLiked.songIds.includes(songId)) {
        userLiked.songIds.push(songId);
        await userLiked.save();
      }
    } else {
      userLiked = await UserLikedSong.create({ uid, songIds: [songId] });
    }

    res.status(200).json({ success: true, message: "Song liked successfully" });
  } catch (error) {
    console.error("Error liking song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const removeLikedSongs = async (req, res) => {
  try {
    const { uid, songId } = req.body;
    if (!uid || !songId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and Song ID are required" });
    }
    const userLiked = await UserLikedSong.findOne({ uid });
    if (!userLiked) {
      return res
        .status(404)
        .json({ success: false, message: "User liked songs not found" });
    }

    // Filter out the songId to remove it
    userLiked.songIds = userLiked.songIds.filter(
      (id) => id.toString() !== songId.toString()
    );
    await userLiked.save();

    res.status(200).json({
      success: true,
      message: "Song removed from liked songs",
      likedSongs: userLiked.songIds,
    });
  } catch (error) {
    console.error("Error removing liked song:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


