const express = require('express')
const router  = express.Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }
    res.json({
      message: 'Account created successfully',
      user: { name, email }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }
    const name = email.split('@')[0]
    res.json({
      message: 'Login successful',
      user: { name, email }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router