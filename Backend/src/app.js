import express from 'express'
import dotenv from 'dotenv'


dotenv.config({
    path: './.env'
})

export const app = express()
