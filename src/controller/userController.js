const User = require("../models/user");
const uploadToCloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const signUp = async (req, res, next) => {
  const { fullName, username, bio, password, confirm_password } = req.body;
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
    return res
      .status(201)
      .json(ApiResponse(true, createdUser, "User registered Successfully"));
  } catch (error) {
    return next(
      new ApiError(500, "Something went wrong while registering the user")
    );
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return next(new ApiError(400, "username is required"));
    }

    
    const user = await User.findOne({username});

    if (!user) {
      return next(new ApiError(404, "User does not exist"));
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);

    
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid user credentials"));
    }
    
    const accessToken = user.generateAccessToken();


    if(!accessToken){
      return next(new ApiError(500,"Something went wrong while generating token"))
    }

    const loggedInUser = await User.findById(user._id).select(
      "-password"
    );

    if(!loggedInUser){
      return next(new ApiError(500,"Something went wrong while login"));
      
    }

    return res
    .status(201)
    .json(ApiResponse(true,{loggedInUser, accessToken} , "User login Successfully"));
    
  } catch (error) {

    return next(new ApiError(500,"Something went wrong while login"));
  }
};

const getAUserFollowerAndFollowing = async(req,res)=>{

  try {
      const {username} = req.query;
    
      if(!username?.trim()){
        return next(new ApiError(400,'username is missing'))
      }
    
      const userProfile = await User.aggregate([
        {
          $match :{
            username : username?.toLowerCase()
          }
        },
        {
          $lookup:{
            from: "followers",
            localField:'_id',
            foreignField:'following',
            as : "followers"
          }
        },
        {
          $lookup:{
            from: "followers",
            localField:'_id',
            foreignField:'follower',
            as : "followings"
          }
        },
        {
          $addFields:{
            followerCount : {
              $size : "$followers"
            },
            followingCount : {
              $size : "$followings"
            },
            isFollowed:{
              $cond:{
                if:{$in: [req.user?._id, "$followers.follower"]},
                then: true,
                else: false
              }
            }
          }
        },
        {
          $project:{
            fullName : 1,
            username: 1,
            followerCount :1,
            followingCount : 1,
            isFollowed :1 ,
            profile_pic : 1,
            bio : 1
    
          }
        }
      ]);
    
      if(!userProfile?.length){
        return next(new ApiError(404, 'User not found'))
      }
    
      return res.status(200).json(ApiResponse(true,userProfile[0], "user profile fetched successfully"))
  } catch (error) {
    return next(new ApiError(500, 'Something went wrong while fetching user detail'))
    
  }
  
  }

module.exports =
{
  signUp ,
  login,
  getAUserFollowerAndFollowing

};
