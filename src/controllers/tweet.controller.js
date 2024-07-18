import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;
  if (!content) throw new ApiError(400, "Content is required");

  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User Id");

  const userTweets = await Tweet.find({ owner: userId });

  if (userTweets?.length === 0)
    throw new ApiError(404, "No tweets found for this user");

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "User Tweet fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid Tweet Id");
  if (!content) throw new ApiError(400, "Content is required");

  const modifiedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );
  if (!modifiedTweet) throw new ApiError(404, "No tweet found");

  return res
    .status(200)
    .json(new ApiResponse(200, modifiedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid Tweet Id");

  const modifiedTweet = await Tweet.findByIdAndDelete(tweetId);
  if (!modifiedTweet) throw new ApiError(404, "No tweet found to delete");

  return res
    .status(200)
    .json(new ApiResponse(200, modifiedTweet, "Tweet deleted successfully"));
});

export { createTweet, deleteTweet, getUserTweets, updateTweet };
