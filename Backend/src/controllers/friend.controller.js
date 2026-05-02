import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const sendFriendRequest = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const currentUser = req.user;

    if (currentUser.username === username) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    const targetUser = await User.findOne({ username });
    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }

    if (targetUser.friends.includes(currentUser._id)) {
        throw new ApiError(400, "You are already friends");
    }

    if (targetUser.friendRequests.includes(currentUser._id)) {
        throw new ApiError(400, "Friend request already sent");
    }

    targetUser.friendRequests.push(currentUser._id);
    await targetUser.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Friend request sent successfully"));
});

const acceptFriendRequest = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const currentUser = await User.findById(req.user._id);

    const requester = await User.findOne({ username });
    if (!requester) {
        throw new ApiError(404, "User not found");
    }

    if (!currentUser.friendRequests.includes(requester._id)) {
        throw new ApiError(400, "No friend request found from this user");
    }

    // Add to each other's friends array
    currentUser.friends.push(requester._id);
    currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== requester._id.toString()
    );

    requester.friends.push(currentUser._id);

    await currentUser.save({ validateBeforeSave: false });
    await requester.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Friend request accepted"));
});

const rejectFriendRequest = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const currentUser = await User.findById(req.user._id);

    const requester = await User.findOne({ username });
    if (!requester) {
        throw new ApiError(404, "User not found");
    }

    if (!currentUser.friendRequests.includes(requester._id)) {
        throw new ApiError(400, "No friend request found from this user");
    }

    // Remove from friend requests
    currentUser.friendRequests = currentUser.friendRequests.filter(
        (id) => id.toString() !== requester._id.toString()
    );

    await currentUser.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Friend request rejected"));
});

const removeFriend = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const currentUser = await User.findById(req.user._id);

    const friendUser = await User.findOne({ username });
    if (!friendUser) {
        throw new ApiError(404, "User not found");
    }

    if (!currentUser.friends.includes(friendUser._id)) {
        throw new ApiError(400, "You are not friends with this user");
    }

    // Remove from both
    currentUser.friends = currentUser.friends.filter(
        (id) => id.toString() !== friendUser._id.toString()
    );
    friendUser.friends = friendUser.friends.filter(
        (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save({ validateBeforeSave: false });
    await friendUser.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Friend removed successfully"));
});

const getFriends = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate(
        "friends",
        "username email avatar level rank"
    );

    return res.status(200).json(new ApiResponse(200, currentUser.friends, "Friends fetched successfully"));
});

const getFriendRequests = asyncHandler(async (req, res) => {
    const currentUser = await User.findById(req.user._id).populate(
        "friendRequests",
        "username email avatar level rank"
    );

    return res.status(200).json(new ApiResponse(200, currentUser.friendRequests, "Friend requests fetched successfully"));
});
export {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getFriendRequests
}