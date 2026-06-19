const express = require('express')
const router = express.Router()
const Groq = require('groq-sdk')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

async function askAI(systemPrompt, userMessage, maxTokens = 1000) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    max_tokens: maxTokens
  })

  return completion.choices[0].message.content
}

// ── TEACH ───────────────────────────────────────────────

router.post('/teach', async (req, res) => {
  try {
    const { topic } = req.body

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        message: 'Topic is required'
      })
    }

    const system = `You are LogicForge, an expert C programming tutor who teaches logic first.

Always follow this structure:

1. Concept
2. Real-world Analogy
3. Syntax
4. Working Example
5. Common Mistakes
6. Mini Challenge

Rules:
- Teach logic before code
- Use simple language
- Use C code blocks
- Encourage learning`

    const reply = await askAI(
      system,
      `Teach me: ${topic}`
    )

    res.json({ reply })

  } catch (err) {
    console.log('Teach error:', err.message)

    res.status(500).json({
      message: 'AI error'
    })
  }
})

// ── CHECK CODE ──────────────────────────────────────────

router.post('/check', async (req, res) => {
  try {
    const { topic, code } = req.body

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: 'Code is required'
      })
    }

    const system = `You are LogicForge reviewing a student's C code.

Rules:
- Explain what is correct
- Explain mistakes
- Show corrected code
- Give score out of 100
- Suggest next topic`

    const reply = await askAI(
      system,
      `Topic: ${topic}

Student Code:

\`\`\`c
${code}
\`\`\``,
      800
    )

    res.json({ reply })

  } catch (err) {
    console.log('Check error:', err.message)

    res.status(500).json({
      message: 'AI error while checking code'
    })
  }
})

// ── EVALUATE ────────────────────────────────────────────

router.post('/evaluate', async (req, res) => {
  try {
    const { problem, topic, code } = req.body

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: 'Code is required'
      })
    }

    const system = `You are LogicForge evaluating a C programming submission.

Return ONLY valid JSON.

{
  "score": 0,
  "summary": "",
  "checks": [
    {
      "ok": true,
      "warn": false,
      "text": ""
    }
  ]
}`

    const raw = await askAI(
      system,
      `Problem: ${problem}

Topic: ${topic}

Code:

\`\`\`c
${code}
\`\`\``,
      600
    )

    const cleaned = raw.replace(/```json|```/g, '').trim()

    const parsed = JSON.parse(cleaned)

    res.json(parsed)

  } catch (err) {
    console.log('Evaluate error:', err.message)

    res.status(500).json({
      score: 0,
      summary: 'Evaluation failed',
      checks: []
    })
  }
})

module.exports = router