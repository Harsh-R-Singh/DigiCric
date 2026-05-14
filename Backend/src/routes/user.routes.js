import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    updateAccountDetails,
    getUserProfile,
    getCurrentUser,
    updateUserStats,
    deleteAccount,
    searchUsers,
    forgotPassword,
    resetPassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").patch(resetPassword)
//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/profile/:username").get(verifyJWT, getUserProfile)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-stats").patch(verifyJWT, updateUserStats)
router.route("/delete-account").delete(verifyJWT, deleteAccount)
router.route("/search").get(verifyJWT, searchUsers)

export default router