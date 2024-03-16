require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

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
      lowercase : true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id: this._id,
          username: this.username,
          fullName: this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}
const User = mongoose.model('User', userSchema);
module.exports = User;
