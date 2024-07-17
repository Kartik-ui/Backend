import { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  //TODO: create playlist
  if (!(name && description))
    throw new ApiError(400, "Name and Description are required");

  const playList = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playList, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists
  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid User ID");

  const userPlayList = await Playlist.find({ owner: userId });

  if (userPlayList?.length === 0)
    throw new ApiError(404, "No playlists found for this user");

  return res
    .status(200)
    .json(
      new ApiResponse(200, userPlayList, "User Playlist fetched successfully")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid Playlist ID");

  const playList = await Playlist.findById(playlistId);

  if (!playList) throw new ApiError(400, "No playlist found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, playList, "Playlist details fetched successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!(isValidObjectId(playlistId) && isValidObjectId(videoId)))
    throw new ApiError(400, "Invalid Playlist or Video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "No video found");

  const playList = await Playlist.findById(playlistId);
  if (!playList) throw new ApiError(400, "No playlist found");

  if (playList.videos.includes(videoId))
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Video already present in playlist"));

  playList.videos.push(videoId);
  await playList.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, playList, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
  if (!(isValidObjectId(playlistId) && isValidObjectId(videoId)))
    throw new ApiError(400, "Invalid Playlist or Video ID");

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(400, "No video found");

  const playList = await Playlist.findById(playlistId);
  if (!playList) throw new ApiError(400, "No playlist found");

  if (!playList.videos.includes(videoId))
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Video not in the playlist"));

  playList.videos.pull(videoId);
  await playList.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, playList, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist Id");

  const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletedPlaylist) throw new ApiError(404, "No playlist found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully")
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
  if (!isValidObjectId(playlistId))
    throw new ApiError(400, "Invalid playlist Id");

  if (!name && !description)
    throw new ApiError(400, "Name or description is required");

  const modifiedPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      name,
      description,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        modifiedPlaylist,
        "Playlist details updated successfully"
      )
    );
});

export {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
};
