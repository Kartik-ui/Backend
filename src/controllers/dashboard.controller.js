import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const userId = req.user._id;

  const totalViews = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const total = totalViews.length > 0 ? totalViews[0].totalViews : 0;

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  const totalVideos = await Video.countDocuments({ owner: userId });

  const totalLikesAgg = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes",
      },
    },
    { $unwind: "$likes" },
    { $group: { _id: null, totalLikes: { $sum: 1 } } },
  ]);

  const response = {
    totalViews: total,
    totalSubscribers,
    totalVideos,
    totalLikes: totalLikesAgg?.[0]?.totalLikes,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const userId = req.user._id;
  let { page = 1, limit = 10 } = req.query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const totalVideosCount = await Video.countDocuments({ owner: userId });

  const channelVideos = await Video.find({ owner: userId })
    .skip((page - 1) * limit)
    .limit(limit);

  if (!channelVideos.length) throw new ApiError(404, "No videos found");

  const totalPages = Math.ceil(totalVideosCount / limit);

  const response = {
    videos: channelVideos,
    totalVideos: totalVideosCount,
    totalPages: totalPages,
    currentPage: page,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "Channel videos fetched successfully")
    );
});

export { getChannelStats, getChannelVideos };
