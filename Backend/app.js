const express = require('express')
const app = express()
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/lobby', (req, res) => {
  res.send('Lobby')
})

app.listen(process.env.PORT, () => {
  console.log(`Backend server running on port ${process.env.PORT}`)
})
