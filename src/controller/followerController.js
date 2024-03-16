const User = require("../models/user");
const Follower = require("../models/follower");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");

const followORUnfollowAUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ username: decodedUser.username });
    if (!user) {
      return next(new ApiError(401, "Unauthorised user"));
    }

    const { username } = req.query;
    const userToBeFollowed = await User.findOne({ username });
    if (!userToBeFollowed) {
      return next(ApiError(404, "User not found"));
    }

    const alreadyFollowedUser = await Follower.findOne({
        follower: user._id,
        following: userToBeFollowed,
    }).populate([{
      path: 'follower',
      select: 'username',
    }, {
      path: 'following',
      select: 'username',
  }]);

    if (alreadyFollowedUser) {
      const unfollowUser = await Follower.findByIdAndDelete(
        alreadyFollowedUser._id
      )
      if(!unfollowUser){
        new ApiError(500, "Something went wrong while unfollowing the user")

      }
      return res
        .status(200)
        .json(
          ApiResponse(true, alreadyFollowedUser, "User unfollow successfull")
        );
    }

    const followUser = await Follower.create({
      follower: user._id,
      following: userToBeFollowed._id,
    })

    if (!followUser) {
      return next(
        new ApiError(500, "Something went wrong while following the user")
      );
    }

    return res
      .status(200)
      .json(ApiResponse(true, {follower:user.username, following:userToBeFollowed.username}, "User followed successfully"));
  } catch (error) {
    return next(
      new ApiError(500, "Something went wrong while follow/unfollow the user")
    );
  }
};


module.exports = {
  followORUnfollowAUser,
};
