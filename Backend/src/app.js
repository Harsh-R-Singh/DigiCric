import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.DEV_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174"
].filter(Boolean);

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

// Global error handler - converts ApiError throws to JSON responses
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        statusCode,
        data: null,
        message: err.message || "Internal Server Error",
        success: false,
        errors: err.errors || []
    });
});

export {app}
