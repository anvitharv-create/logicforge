const express = require('express')
const cors    = require('cors')
require('dotenv').config()

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

app.use(express.json())

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/ai',   require('./routes/aiRoutes'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LogicForge server running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✓`)
  console.log(`Gemini key: ${process.env.GEMINI_API_KEY ? 'loaded ✓' : 'MISSING ✗'}`)
})