import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import UserStats from "../models/userstats.models.js";

const getLeaderboard = asyncHandler(async (req, res) => {
    const { type = 'xp' } = req.query;
    
    let topPlayers = [];
    let userCurrentRank = null;
    let userCurrentScore = 0;
    
    if (type === 'xp' || type === 'volts') {
        const sortField = type === 'xp' ? 'xp' : 'volts';
        
        const players = await User.find({})
            .sort({ [sortField]: -1 })
            .limit(50)
            .select("-password -email -refreshToken");
            
        topPlayers = players.map(p => ({
           _id: p._id,
           username: p.username,
           avatar: p.avatar,
           level: p.level,
           rank: p.rank,
           scoreValue: p[sortField]
        }));
            
        if (req.user) {
            const currentUserVal = req.user[sortField];
            userCurrentScore = currentUserVal;
            const rankCount = await User.countDocuments({ [sortField]: { $gt: currentUserVal } });
            userCurrentRank = rankCount + 1;
        }
    } else if (type === 'wins' || type === 'netRunRate') {
        const sortField = type === 'wins' ? 'totalWins' : 'netRunRate';
        
        const stats = await UserStats.find({})
            .sort({ [sortField]: -1 })
            .limit(50)
            .populate('userId', 'username avatar level rank');
            
        topPlayers = stats.filter(s => s.userId).map(stat => ({
            _id: stat.userId._id,
            username: stat.userId.username,
            avatar: stat.userId.avatar,
            level: stat.userId.level,
            rank: stat.userId.rank,
            scoreValue: stat[sortField]
        }));
        
        if (req.user) {
            const myStat = await UserStats.findOne({ userId: req.user._id });
            const currentUserVal = myStat ? myStat[sortField] : 0;
            userCurrentScore = currentUserVal;
            const rankCount = await UserStats.countDocuments({ [sortField]: { $gt: currentUserVal } });
            userCurrentRank = rankCount + 1;
        }
    } else {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid leaderboard type"));
    }

    return res.status(200).json(
        new ApiResponse(200, {
            leaderboard: topPlayers,
            userRank: userCurrentRank,
            userScore: userCurrentScore
        }, "Leaderboard fetched successfully")
    );
});

export { getLeaderboard }
