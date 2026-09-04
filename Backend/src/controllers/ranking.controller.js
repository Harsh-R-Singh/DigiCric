import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import UserStats from "../models/userstats.models.js";
import { redisClient } from "../db/redis.js";

const getLeaderboard = asyncHandler(async (req, res) => {
    const { type = 'xp' } = req.query;
    
    let topPlayers = [];
    let userCurrentRank = null;
    let userCurrentScore = 0;
    
    const cacheKey = `leaderboard:${type}`;
    
    // 1. Try to get leaderboard from Redis cache
    if (redisClient && redisClient.isOpen) {
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                topPlayers = parsedData.leaderboard || [];
            }
        } catch (err) {
            console.error('Redis get error:', err);
        }
    }
    
    // 2. If not found in cache, fetch from MongoDB
    if (topPlayers.length === 0) {
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
            
        } else {
            return res.status(400).json(new ApiResponse(400, {}, "Invalid leaderboard type"));
        }
        
        // Save to cache (expires in 5 minutes)
        if (redisClient && redisClient.isOpen) {
            try {
                await redisClient.setEx(cacheKey, 300, JSON.stringify({ leaderboard: topPlayers }));
            } catch (err) {
                console.error('Redis set error:', err);
            }
        }
    }

    // 3. Fetch current user specific data (not cached as it varies per user request)
    if (req.user) {
        if (type === 'xp' || type === 'volts') {
            const sortField = type === 'xp' ? 'xp' : 'volts';
            const currentUserVal = req.user[sortField];
            userCurrentScore = currentUserVal;
            const rankCount = await User.countDocuments({ [sortField]: { $gt: currentUserVal } });
            userCurrentRank = rankCount + 1;
        } else if (type === 'wins' || type === 'netRunRate') {
            const sortField = type === 'wins' ? 'totalWins' : 'netRunRate';
            const myStat = await UserStats.findOne({ userId: req.user._id });
            const currentUserVal = myStat ? myStat[sortField] : 0;
            userCurrentScore = currentUserVal;
            const rankCount = await UserStats.countDocuments({ [sortField]: { $gt: currentUserVal } });
            userCurrentRank = rankCount + 1;
        }
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
