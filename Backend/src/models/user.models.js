import mongoose from "mongoose";
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
    level:{
        type:Number,
        default:1
    },
    xp:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        enum:["avatar1","avatar2","avatar3","avatar4","avatar5","avatar6","avatar7","avatar8","avatar9","avatar10","avatar11"],
        default:"avatar1"
    },
    
},{timestamps:true})

const User = mongoose.model("User", userSchema)
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
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
export default User