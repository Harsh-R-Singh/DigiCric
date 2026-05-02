import { Router } from "express";
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    removeFriend, 
    getFriends, 
    getFriendRequests,
    checkFriendStatus 
} from "../controllers/friend.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/friend-request/:username").post(verifyJWT, sendFriendRequest)
router.route("/friend-request/accept/:username").post(verifyJWT, acceptFriendRequest)
router.route("/friend-request/reject/:username").post(verifyJWT, rejectFriendRequest)
router.route("/friend/:username").delete(verifyJWT, removeFriend)
router.route("/friends").get(verifyJWT, getFriends)
router.route("/friend-requests").get(verifyJWT, getFriendRequests)
router.route("/friend-status/:username").get(verifyJWT, checkFriendStatus)

export default router;