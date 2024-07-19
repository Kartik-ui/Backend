import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

  const videoLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id,
  });

  if (videoLike) {
    await videoLike.deleteOne();
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Video Like deleted successfully"));
  } else {
    const createVideoLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, createVideoLike, "Video Like created successfully")
      );
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Invalid Comment Id");

  const commentLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (commentLike) {
    await commentLike.deleteOne();
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Comment Like deleted successfully"));
  } else {
    const createCommentLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          createCommentLike,
          "Comment Like created successfully"
        )
      );
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid Tweet Id");

  const tweetLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id,
  });

  if (tweetLike) {
    await tweetLike.deleteOne();
    return res
      .status(201)
      .json(new ApiResponse(201, {}, "Tweet Like deleted successfully"));
  } else {
    const createTweetLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });
    return res
      .status(201)
      .json(
        new ApiResponse(201, createTweetLike, "Tweet Like created successfully")
      );
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const userId = req.user._id;

  const likedVideos = await Like.find({
    likedBy: userId,
    video: { $exists: true },
  });

  if (!likedVideos.length) throw new ApiError(404, "No liked videos exists");

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike };
