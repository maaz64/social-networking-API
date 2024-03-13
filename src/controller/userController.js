const User = require("../models/user");
const uploadToCloudinary = require("../utils/cloudinary");
const ApiError = require('../utils/ApiError');
const {ApiResponse} = require('../utils/ApiResponse');


const signUp = async (req, res, next) => {
  const { fullName, username, bio, password, confirm_password } = req.body;
  console.log(`${fullName} ${username} ${bio} ${password} ${confirm_password}`);
  try {
  if (
    [fullName, username, bio, password, confirm_password].some(
      (field) => field?.trim() === ""
    )
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  if (password != confirm_password) {
    return next(new ApiError(409, "Password doesn't match"));
  }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
      return next(new ApiError(409, "User with  username already exists"));
    }

    const profilePicLocalPath = req.file?.path;
    console.log(profilePicLocalPath);
    if (!profilePicLocalPath) {
      return next(new ApiError(400, "Profile picture is required"));
    }

    const profileImgURL = await uploadToCloudinary(profilePicLocalPath);

    if (!profileImgURL) {
      throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
      fullName,
      username: username,
      bio,
      profile_pic: profileImgURL.url,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
      return next(
        new ApiError(502, "Something went wrong while registering the user")
      );
    }
    return res.status(201).json(ApiResponse(true, createdUser, "User registered Successfully"));
  } catch (error) {
    return next(
        new ApiError(500, "Something went wrong while registering the user")
      );
  }
};

module.exports = {signUp}
