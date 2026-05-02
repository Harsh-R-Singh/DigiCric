import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// import {Avatar1 ,Avatar2,Avatar3,Avatar4,Avatar5} from "../assets/avatars"
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
    friendRequests:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    friends:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    avatar:{
        type:String,
        enum:["Avatar1","Avatar2","Avatar3","Avatar4","Avatar5","Avatar6","Avatar7","Avatar8","Avatar9","Avatar10","Avatar11"],
        default:"Avatar1"
    },
    level:{
        type:Number,
        default:1
    },
    rank:{
        type:String,
        default:"Newbie"
    },
     volts:{
        type:Number,
        default:0
    },
    xp:{
        type:Number,
        default:0
    },
    refreshToken: {
        type: String
    }
    
},{timestamps:true})

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema)