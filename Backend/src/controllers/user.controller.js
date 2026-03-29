import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";

const registerUser = asyncHandler(async (req, res) => {
    // const { username, email, password } = req.body
    // if(!username || !email || !password){
    //     throw new ApiError(400, "All fields are required")
    // }
    // const user = await User.create({
    //     username,
    //     email,
    //     password
    // })
    return res.status(201).json(new ApiResponse(200, {}, "User registered successfully"))
})

export { registerUser }