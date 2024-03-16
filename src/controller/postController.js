const Follower = require("../models/follower");
const Post = require("../models/post");
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");

const getLoggedInUser = async (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findOne({ username: decodedUser.username });
  return user;
};

const createPost = async (req, res, next) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) {
      return next(new ApiError(401, "Unauthorised user"));
    }
    const { content } = req.body;
    if (!content) {
      return next(new ApiError(400, "Content is required"));
    }

    const post = await Post.create({
      content,
      user: user._id,
    });

    if (!post) {
      return next(
        new ApiError(500, "Something went wrong while creating post")
      );
    }

    return res
      .status(201)
      .json(ApiResponse(true, post, "Post created successfully"));
  } catch (error) {
    return next(new ApiError(500, "Something went wrong while creating post"));
  }
};
const getPost = async (req, res, next) => {
  const user = await getLoggedInUser(req);
  if (!user) {
    return next(new ApiError(401, "Unauthorised user"));
  }
  const { postId } = req.query;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(404, "No post found"));
  }

  return res
    .status(200)
    .json(ApiResponse(true, post, "Post fetched successfully"));
};

const updatePost = async (req, res, next) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) {
      return next(new ApiError(401, "Unauthorised user"));
    }

    const { postId } = req.query;
    const content = req.body.content;

    if (!content) {
      return next(new ApiError(400, "Content is required"));
    }
    const post = await Post.findById(postId);
    if (!post) {
      return next(new ApiError(404, "No post found"));
    }
    if (post.user.toString() != user._id.toString()) {
      return next(new ApiError(401, "Unauthorised user"));
    }
    if (post.content === content) {
      return next(new ApiError(400, "No change in your post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      { content },
      { new: true }
    );
    if (!updatePost) {
      return next(
        new ApiError(500, "something went wrong while updating the post")
      );
    }
    return res
      .status(200)
      .json(ApiResponse(true, updatedPost, "Post Updated successfully"));
  } catch (error) {
    return next(
      new ApiError(500, "something went wrong while updating the post")
    );
  }
};

const deletePost = async (req, res, next) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) {
      return next(new ApiError(401, "Unauthorised user"));
    }

    const { postId } = req.query;

    const post = await Post.findById(postId);
    if (!post) {
      return next(new ApiError(404, "No post found"));
    }
    if (post.user.toString() != user._id.toString()) {
      return next(new ApiError(401, "Unauthorised user"));
    }
    const deleteddPost = await Post.findByIdAndDelete(post._id);
    if (!deleteddPost) {
      return next(
        new ApiError(500, "something went wrong while deleting the post")
      );
    }

    return res
      .status(200)
      .json(ApiResponse(true, deleteddPost, "Post deleted successfully"));
  } catch (error) {
    return next(
      new ApiError(500, "something went wrong while deleting the post")
    );
  }
};

const getLatestPostsOfFollowedUser = async (req, res, next) => {
  try {
    const user = await getLoggedInUser(req);
    if (!user) {
      return next(new ApiError(401, "Unauthorised user"));
    }
    const { username } = req.query;
    const isUserExist = await User.findOne({ username });
    if (!isUserExist) {
      return next(new ApiError(404, "User not found"));
    }
    const followedUser = await Follower.find({
      follower: user._id,
      following: isUserExist._id,
    });

    if (!followedUser?.length) {
      return next(new ApiError(400, "Follow the user to see their post"));
    }

    const posts = await Post.aggregate([
      {
        $match: {
          user: isUserExist._id,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
     
    ]);

    if (!posts.length) {
      return next(new ApiError(404, "No post found"));
    }

    return res
      .status(200)
      .json(ApiResponse(true, posts, "All posts fetched successfully"));
  } catch (error) {
    return next(
      new ApiError(500, "Something went wrong while fetching the posts")
    );
  }
};

module.exports = {
  createPost,
  getPost,
  updatePost,
  deletePost,
  getLatestPostsOfFollowedUser,
};
