import { Router } from "express";
import { 
    getLeaderboard
} from "../controllers/ranking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/leaderboard").get(verifyJWT, getLeaderboard)

export default router