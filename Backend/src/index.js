import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from './app.js'
import { createServer } from "http";
import { Server } from "socket.io";
import setupSocket from "./socket.js";

dotenv.config({
    path: './.env'
})

const server = createServer(app);

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.DEV_ORIGIN,
    "http://localhost:5173",
    "http://localhost:5174"
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});

setupSocket(io);

connectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})