import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import UserStats from "../models/userstats.models.js";
import jwt from "jsonwebtoken"
// import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body
    if(!username || !email || !password){
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"))
        // throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        return res.status(409).json(new ApiResponse(409, {}, "User with email or username already exists"))
    }

    const user = await User.create({
        username,
        email,
        password,
        avatar: "Avatar1"
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    if (!createdUser) {
        return res.status(500).json(new ApiResponse(500, {}, "Something went wrong while registering the user"))
        // throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body

    if (!username && !email) {
        return res
        .status(400)
        .json(
            new ApiResponse(
            400, 
            {},
            "username or email is required"
            )
        )
        // throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        return res
        .status(404)
        .json(
            new ApiResponse(
            404, 
            {},
            "User does not exist"
            )
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res
        .status(401)
        .json(
            new ApiResponse(
            401, 
            {},
            "Invalid user credentials"
            )
        )
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body

    

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid old password"));
        // throw new ApiError(400, "Invalid old password")
    }

    if (!newPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "New password is required"));
        // throw new ApiError(400, "New password is required")
    }

    if(oldPassword === newPassword) {
        return res.status(400).json(new ApiResponse(400, {}, "New password cannot be same as old password"));
        // throw new ApiError(400, "New password cannot be same as old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {username, email} = req.body

    if (!username || !email) {
        return res.status(400).json(new ApiResponse(400, {}, "All fields are required"));
        // throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({ username, _id: { $ne: req.user._id } });
    if (existingUser) {
        return res.status(409).json(new ApiResponse(409, {}, "Username already exists"));
        // throw new ApiError(409, "Username already exists");
    }

    const existingEmail = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingEmail) {
        return res.status(409).json(new ApiResponse(409, {}, "Email already exists"));
        // throw new ApiError(409, "Email already exists");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});

const getUserProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const userProfile = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "userstats",
                localField: "_id",
                foreignField: "userId",
                as: "stats"
            }
        },
        {
            $addFields: {
                stats: {
                    $first: "$stats"
                }
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                avatar: 1,
                createdAt: 1,
                matchesPlayed: { $ifNull: ["$stats.matchesPlayed", 0] },
                totalWins: { $ifNull: ["$stats.totalWins", 0] },
                totalLosses: { $ifNull: ["$stats.totalLosses", 0] },
                totalDraws: { $ifNull: ["$stats.totalDraws", 0] },
                totalRunsScored: { $ifNull: ["$stats.totalRunsScored", 0] },
                totalRunsConceded: { $ifNull: ["$stats.totalRunsConceded", 0] },
                totalWicketsTaken: { $ifNull: ["$stats.totalWicketsTaken", 0] },
                netRunRate: { $ifNull: ["$stats.netRunRate", 0] },
                volts: { $ifNull: ["$stats.volts", 0] },
                highestScore: { $ifNull: ["$stats.highestScore", 0] },
                level: { $ifNull: ["$stats.level", 1] },
                rank: { $ifNull: ["$stats.rank", "Newbie"] },
                xp: { $ifNull: ["$stats.xp", 0] },
            }
        }
    ])

    if (!userProfile?.length) {
        throw new ApiError(404, "User does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, userProfile[0], "User profile fetched successfully")
    )
})

const updateUserStats = asyncHandler(async(req, res) => {
    const {winner, loses, draws, volts, userScore, runsConceded, wicketsTaken, netRunRate,xp} = req.body;
    
    // verifyJWT middleware already appends the authenticated user to req.user
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User details missing from request");
    }

    const updateQuery = {
        $inc: {
            matchesPlayed: 1,
            totalWins: winner ? 1 : 0,
            totalLosses: loses ? 1 : 0,
            totalDraws: draws ? 1 : 0,
            totalRunsScored: Number(userScore) || 0,
            totalRunsConceded: Number(runsConceded) || 0,
            totalWicketsTaken: Number(wicketsTaken) || 0,
            netRunRate: Number(netRunRate) || 0,
            volts: Number(volts) || 0,
            xp: Number(xp) || 0
        },
        $max: {
            highestScore: Number(userScore) || 0
        },
        $set: {
            level: Math.floor((xp /3000)+1),
            rank: volts >= 50000 ? "Legend" : volts >= 25000 ? "Master" : volts >= 10000 ? "Pro" : volts >= 5000 ? "Intermediate" : "Newbie"
        }
    };

    const updatedStats = await UserStats.findOneAndUpdate(
        { userId: userId },
        updateQuery,
        { new: true, upsert: true }
    );

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedStats, "User stats updated successfully")
    );
})

const deleteAccount = asyncHandler(async(req, res) => {
    // Delete user stats from UserStats collection
    await UserStats.findOneAndDelete({ userId: req.user._id });
    // Delete user from User collection
    await User.findByIdAndDelete(req.user._id);
    

    // Clear cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User account successfully deleted"));
});

export {
     registerUser,
     loginUser,
     logoutUser, 
     refreshAccessToken , 
     changeCurrentPassword , 
     getCurrentUser , 
     updateAccountDetails,
     getUserProfile,
     updateUserStats,
     deleteAccount
}