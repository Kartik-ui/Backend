import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription
  if (!isValidObjectId(channelId))
    throw new ApiError(400, "Invalid Channel ID");

  const subscriptionCheck = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id,
  });

  if (subscriptionCheck) {
    await subscriptionCheck.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Subscription removed successfully"));
  }

  const createSubscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createSubscription,
        "Congratulations! You have Successfully Subscribed this channel"
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId))
    throw new ApiError(400, "Invalid Channel ID");

  const subscriptions = await Subscription.find({
    channel: channelId,
  })
    .populate("subscriber", "fullName email userName avatar coverImage")
    .exec();

  if (!subscriptions.length) {
    throw new ApiError(404, "No subscribers found for this channel");
  }

  const subscribers = subscriptions?.map((item) => item?.subscriber);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId))
    throw new ApiError(400, "Invalid Subscriber ID");

  const channelSubscription = await Subscription.find({
    subscriber: subscriberId,
  })
    .populate("channel", "fullName email userName avatar coverImage")
    .exec();

  if (!channelSubscription.length) {
    throw new ApiError(404, "No subscriptions found for this user");
  }

  const channelSubscribed = channelSubscription?.map((item) => item?.channel);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubscribed,
        "Channels Subscribed fetched successfully"
      )
    );
});

export { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription };
