

import mongoose from 'mongoose';
const { Schema } = mongoose;

const SongSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    spotifyId: { type: String, required: true, unique: true }, // Unique Spotify ID
    duration: { type: Number }, // Duration in seconds
    album: { type: String },
    coverImage: { type: String }// URL to album cover
    
});

export const Song = mongoose.model('Song', SongSchema);

