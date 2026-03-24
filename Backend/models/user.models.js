import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username already exists"],
        min:[5,"Username must be at least 5 characters long"],
        max:[20,"Username must be at most 20 characters long"]
    },
    email: {
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"],
        lowercase:true,
        // trim:true
    },
    password: {
        type:String,
        required:[true,"Password is required"],
        min:[8,"Password must be at least 8 characters long"]
    },
    // avatar:{
    //     type:String,
    //     required:[true,"Avatar is required"]
    // }
},{timestamps:true})

const User = mongoose.model("User", userSchema)

export default User