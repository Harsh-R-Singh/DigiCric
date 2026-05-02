import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config({
    path: './.env'
})

const app = express()

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.DEV_ORIGIN
];

app.use(cors({
    origin: allowedOrigins ,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from "./routes/user.routes.js"
import rankingRouter from "./routes/ranking.routes.js"
import friendRouter from "./routes/friend.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/rankings", rankingRouter)
app.use("/api/v1/friends", friendRouter)
export {app}
