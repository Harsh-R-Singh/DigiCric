import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username already exists"],
        min:[5,"Username must be at least 5 characters long"],
        max:[20,"Username must be at most 20 characters long"],
        trim:true
    },
    email: {
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"],
        lowercase:true,
    },
    password: {
        type:String,
        required:[true,"Password is required"],
        min:[6,"Password must be at least 6 characters long"],
        max:[20,"Password must be at most 20 characters long"]
    },
    level:{
        type:Number,
        default:1
    },
    xp:{
        type:Number,
        default:0
    },
    // avatar:{
    //     type:String,
    //     required:[true,"Avatar is required"]
    // }
},{timestamps:true})

const User = mongoose.model("User", userSchema)

export default User