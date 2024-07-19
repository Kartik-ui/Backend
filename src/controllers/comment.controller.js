import { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

  const comments = await Comment.paginate(
    { video: videoId },
    {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      customLabels: {
        docs: "comments",
        totalDocs: "totalComments",
      },
      populate: { path: "owner", select: "fullName userName avatar" },
      sort: { createdAt: -1 },
    }
  );

  if (!comments.comments.length)
    throw new ApiError(404, "No comments found for this video");

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

  if (!content) throw new ApiError(400, "Content is required");

  const addComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, addComment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Invalid Comment Id");

  if (!content) throw new ApiError(400, "Content is required");

  const modifiedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    { new: true }
  );

  if (!modifiedComment) throw new ApiError(404, "No comment found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, modifiedComment, "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Invalid Comment ID");

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) throw new ApiError(404, "Comment not found");

  return res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export { addComment, deleteComment, getVideoComments, updateComment };
