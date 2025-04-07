import mongoose from 'mongoose';
const { Schema } = mongoose;
const RecentlyPlayedSchema = new Schema({
    uid: {
      type: String,
      ref: 'User',
      required: true
    },
    songIds:[ {
      type: String,
      ref: 'Song',
      required: true
    }],
    playedAt: {
      type: Date,
      default: Date.now
    },
   
  });





export const RecentlyPlayed = mongoose.model('RecentlyPlayed', RecentlyPlayedSchema);

