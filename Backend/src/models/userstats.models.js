import mongoose from "mongoose";

const userStatsSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    volts:{
        type:Number,
        default:0
    },
    matchesPlayed:{
        type:Number,
        default:0
    },
    totalWins:{
        type:Number,
        default:0
    },
    totalLosses:{
        type:Number,
        default:0
    },
    totalDraws:{
        type:Number,
        default:0
    },
    totalPoints:{
        type:Number,
        default:0
    },
    totalRunsScored:{
        type:Number,
        default:0
    },
    totalWicketsTaken:{
        type:Number,
        default:0
    },
    highestScore:{
        type:Number,
        default:0
    },
})

const UserStats = mongoose.model("UserStats", userStatsSchema)

export default UserStats