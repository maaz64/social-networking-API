const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim : true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      // lowercase : true,
      trim : true,
      index : true
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic:{
      type: String,
      // required: true,
    },
    follower : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'

      }
    ],
    following : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'

      }
    ]
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
