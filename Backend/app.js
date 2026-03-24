const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')


require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/lobby', (req, res) => {
  res.send('Lobby')
})

app.listen(process.env.PORT, () => {
  console.log(`Backend server running on port ${process.env.PORT}`)
})
