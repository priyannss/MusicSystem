import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    uid:{
     type:String,
     required:true
    },
    name: {
      type: String,
     
      trim: true
    },
  });

UserSchema.methods.getToken =  function() {
   return  jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });
};

export const User = mongoose.model('User', UserSchema);

