const express = require('express')
const router  = express.Router()
const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

async function askGemini(systemPrompt, userMessage, maxTokens = 1000) {
  const result = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
    }],
    generationConfig: { maxOutputTokens: maxTokens }
  })
  return result.response.text()
}

// ── TEACH ─────────────────────────────────────────────────────────────────────
router.post('/teach', async (req, res) => {
  try {
    const { topic } = req.body
    if (!topic || !topic.trim()) {
      return res.status(400).json({ message: 'Topic is required' })
    }
    const system = `You are LogicForge, an expert C programming tutor who teaches logic first.

Always follow this structure:
1. Concept: plain English explanation in 2-3 sentences
2. Real-world Analogy: a memorable everyday comparison
3. Syntax: show C syntax with a comment on every line
4. Working Example: short compilable C code
5. Common Mistakes: 2-3 mistakes beginners make
6. Mini Challenge: one task the student must attempt themselves

Rules:
- NEVER give the final answer before student tries
- Use triple backtick c code blocks for all code
- Be encouraging and clear`

    const reply = await askGemini(system, `Teach me: ${topic}`)
    res.json({ reply })
  } catch (err) {
    console.log('Teach error:', err.message)
    res.status(500).json({ message: 'AI error. Check your Gemini API key in .env' })
  }
})

// ── CHECK CODE ────────────────────────────────────────────────────────────────
router.post('/check', async (req, res) => {
  try {
    const { topic, code } = req.body
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code is required' })
    }
    const system = `You are LogicForge, reviewing a student's C code.

Rules:
- First tell them what they got RIGHT (be specific)
- Then explain each error and WHY it matters in C
- Show corrected version only AFTER explaining errors
- Give a score out of 100
- End with one encouragement and one thing to study next
- Use code blocks for all code`

    const reply = await askGemini(
      system,
      `Topic: ${topic}\n\nStudent code:\n\`\`\`c\n${code}\n\`\`\``,
      800
    )
    res.json({ reply })
  } catch (err) {
    console.log('Check error:', err.message)
    res.status(500).json({ message: 'AI error while checking code' })
  }
})

// ── EVALUATE ──────────────────────────────────────────────────────────────────
router.post('/evaluate', async (req, res) => {
  try {
    const { problem, topic, code } = req.body
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code is required' })
    }
    const system = `You are LogicForge evaluating a C practice submission.

Respond ONLY with valid JSON. No markdown, no extra text before or after.

JSON format:
{
  "score": <number 0-100>,
  "summary": "<one sentence verdict>",
  "checks": [
    { "ok": true,  "warn": false, "text": "<something correct>" },
    { "ok": false, "warn": true,  "text": "<suggestion or warning>" },
    { "ok": false, "warn": false, "text": "<real error to fix>" }
  ]
}

Scoring: correctness=50pts, best practices=30pts, clarity=20pts
Give 3-5 check items.`

    const raw     = await askGemini(
      system,
      `Problem: ${problem} (${topic})\n\nCode:\n\`\`\`c\n${code}\n\`\`\``,
      600
    )
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed  = JSON.parse(cleaned)
    res.json(parsed)
  } catch (err) {
    console.log('Evaluate error:', err.message)
    res.status(500).json({ score:0, summary:'Evaluation failed.', checks:[] })
  }
})

module.exports = router