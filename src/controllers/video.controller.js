import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = 1,
    userId,
  } = req.query;
  //TODO: get all videos based on query, sort, pagination
  let matchCondition = {};
  if (userId) matchCondition.owner = new mongoose.Types.ObjectId(userId);

  const videoAggregate = Video.aggregate([
    {
      $match: {
        ...matchCondition,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullName: 1, userName: 1, avatar: 1 } }],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: { [sortBy]: parseInt(sortType) },
    },
  ]);
  if (!videoAggregate) throw new ApiError(500, "Internal Server Error");

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    customLabels: {
      totalDocs: "totalVideos",
      docs: "videos",
    },
    skip: (page - 1) * limit,
  };

  const result = await Video.aggregatePaginate(videoAggregate, options);

  if (result.videos.length === 0 && userId)
    return res.status(200).json(new ApiResponse(200, [], "No videos found"));

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  if (!title || !description)
    throw new ApiError(400, "title or description can't be empty");

  const existingVideo = await Video.findOne({
    $or: [{ title }, { description }],
  });
  if (existingVideo)
    throw new ApiError(
      409,
      "A video with same title or description already exists"
    );

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath)
    throw new ApiError(400, "provide video and thumbnail to upload");

  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!video.url || !thumbnail.url)
    throw new ApiError(500, "Error while uploading video or thumbnail");

  const videoPublished = await Video.create({
    title,
    description,
    videoFile: video.url,
    thumbnail: thumbnail.url,
    duration: video.duration,
    owner: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, videoPublished, "Video Published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "No video found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!title && !description && !thumbnailLocalPath)
    throw new ApiError(400, "Nothing to update");

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Video ID");
  }

  let updateFields = { title, description };

  if (thumbnailLocalPath) {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new ApiError(400, "No video found");
    }

    const oldThumbnailUrl = video.thumbnail;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(400, "Error uploading thumbnail on cloudinary");
    }

    updateFields.thumbnail = thumbnail.url;

    await deleteOnCloudinary(oldThumbnailUrl, "image");
  }

  const modifiedVideo = await Video.findByIdAndUpdate(
    videoId,
    { $set: updateFields },
    { new: true }
  );

  if (!modifiedVideo) {
    throw new ApiError(500, "Unable to update video details");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, modifiedVideo, "Video details updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "No video found");

  const deleteVideo = await Video.findByIdAndDelete(videoId);

  await deleteOnCloudinary(video.videoFile, "video");
  await deleteOnCloudinary(video.thumbnail, "image");

  return res
    .status(200)
    .json(new ApiResponse(200, deleteVideo, "Video Deleted Successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "No Video found");

  video.isPublished = !video.isPublished;

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "isPublished toggle successfully"));
});

const incrementViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) throw new ApiError(200, "Invalid Video ID");

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) throw new ApiError(200, "No Videos Found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Views incremented successfully"));
});

export {
  deleteVideo,
  getAllVideos,
  getVideoById,
  incrementViews,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
};
