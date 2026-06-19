import { useState } from 'react'

const STEPS = ['Concept', 'Analogy', 'Syntax', 'Try It']
const QUICK = ['Pointers in C', 'Arrays & loops', 'Recursive functions', 'malloc & free', 'Structs', 'Strings']

function renderAI(text) {
  return text.split(/(```[\s\S]*?```)/g).map((p, i) => {
    if (p.startsWith('```')) {
      const code = p.replace(/```\w*\n?/, '').replace(/```$/, '')
      return (
        <div key={i} style={s.codeWrap}>
          <div style={s.codeBar}>
            <div style={s.codeDots}>
              <span style={{ ...s.dot, background: '#EF4444' }} />
              <span style={{ ...s.dot, background: '#F59E0B' }} />
              <span style={{ ...s.dot, background: '#10B981' }} />
            </div>
            <span style={s.codeLang}>C</span>
          </div>
          <pre style={s.codeBlock}><code>{code}</code></pre>
        </div>
      )
    }
    return p.split('\n').filter(l => l.trim()).map((line, j) => (
      <p key={`${i}-${j}`} style={s.para}>{line}</p>
    ))
  })
}

export default function Learn() {
  const [query,    setQuery]    = useState('')
  const [topic,    setTopic]    = useState('C Programming')
  const [resp,     setResp]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [step,     setStep]     = useState(0)
  const [code,     setCode]     = useState('')
  const [feedback, setFeedback] = useState('')
  const [checking, setChecking] = useState(false)

  async function askTopic(t) {
    setTopic(t)
    setResp('')
    setFeedback('')
    setCode('')
    setError('')
    setLoading(true)
    setStep(0)
    try {
      const res = await fetch('http://localhost:5000/api/ai/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'AI error')
      setResp(data.reply)
      setStep(2)
    } catch (e) {
      setError(e.message || 'Backend not running on port 5000. Start the server first.')
    }
    setLoading(false)
  }

  async function checkCode() {
    if (!code.trim()) return
    setChecking(true)
    setFeedback('')
    try {
      const res = await fetch('http://localhost:5000/api/ai/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Check failed')
      setFeedback(data.reply)
      setStep(3)
    } catch (e) {
      setFeedback('Could not evaluate. Is the backend running?')
    }
    setChecking(false)
  }

  function send() {
    if (!query.trim()) return
    askTopic(query)
    setQuery('')
  }

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <div style={s.topIcon}>◉</div>
          <div>
            <div style={s.topTitle}>{topic}</div>
            <div style={s.topSub}>AI Teaching Mode</div>
          </div>
        </div>
        <div style={s.tabs}>
          {['Teach', 'Practice', 'Test'].map((m, i) => (
            <span key={m} style={{ ...s.tab, ...(i === 0 ? s.tabActive : {}) }}>{m}</span>
          ))}
        </div>
      </div>

      <div style={s.content}>
        {/* Steps */}
        <div style={s.stepsRow}>
          {STEPS.map((name, i) => (
            <div key={name} style={s.stepItem}>
              <div style={{
                ...s.stepCircle,
                ...(i === step ? s.stepCircleNow : {}),
                ...(i < step ? s.stepCircleDone : {}),
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <div>
                <div style={s.stepName}>{name}</div>
                <div style={{
                  ...s.stepStatus,
                  color: i < step ? 'var(--green)' : i === step ? 'var(--accent)' : 'var(--muted)'
                }}>
                  {i < step ? 'Done' : i === step ? 'Active' : 'Locked'}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ ...s.stepLine, ...(i < step ? s.stepLineDone : {}) }} />
              )}
            </div>
          ))}
        </div>

        {/* Welcome state */}
        {!resp && !loading && (
          <div style={s.welcomeCard}>
            <div style={s.welcomeIconWrap}>
              <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
                <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" />
                <circle cx="18" cy="18" r="7" stroke="rgba(6,182,212,0.5)" strokeWidth="1.2" fill="none" />
                <circle cx="18" cy="11" r="2" fill="#3B82F6" />
                <circle cx="24.5" cy="14.5" r="1.5" fill="#06B6D4" />
                <circle cx="24.5" cy="21.5" r="1.5" fill="#06B6D4" />
                <circle cx="18" cy="25" r="2" fill="#10B981" />
                <circle cx="11.5" cy="21.5" r="1.5" fill="#06B6D4" />
                <circle cx="11.5" cy="14.5" r="1.5" fill="#06B6D4" />
                <circle cx="18" cy="18" r="2.5" fill="#3B82F6" />
                <circle cx="18" cy="18" r="1" fill="white" opacity="0.9" />
              </svg>
            </div>
            <div style={s.welcomeTitle}>What do you want to learn?</div>
            <div style={s.welcomeSub}>
              LogicForge teaches concept first, then code. Never just answers — always understanding.
            </div>
            <div style={s.quickGrid}>
              {QUICK.map(t => (
                <button key={t} style={s.quickChip} onClick={() => askTopic(t)}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={s.loadCard}>
            <span style={s.loadRing} />
            <div>
              <div style={s.loadMain}>Forging your lesson...</div>
              <div style={s.loadSub}>Building a step-by-step explanation of <strong style={{ color: 'var(--accent)' }}>{topic}</strong></div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div style={s.errorCard}>⚠ {error}</div>}

        {/* AI Response */}
        {resp && (
          <div style={s.respCard}>
            <div style={s.respHeader}>
              <div style={s.aiBadge}>
                <span style={s.aiDot} />
                LogicForge AI
              </div>
              <span style={s.respLabel}>Teaching: {topic}</span>
            </div>
            <div style={s.respBody}>{renderAI(resp)}</div>
          </div>
        )}

        {/* Code attempt */}
        {resp && (
          <div style={s.attemptCard}>
            <div style={s.attemptHeader}>
              <div style={s.attemptTitle}>◎ Your Attempt</div>
              <div style={s.attemptSub}>Write code before checking — no shortcuts!</div>
            </div>
            <div style={s.editorWrap}>
              <div style={s.editorBar}>
                <div style={s.codeDots}>
                  <span style={{ ...s.dot, background: '#EF4444' }} />
                  <span style={{ ...s.dot, background: '#F59E0B' }} />
                  <span style={{ ...s.dot, background: '#10B981' }} />
                </div>
                <span style={s.editorFile}>solution.c</span>
              </div>
              <textarea
                style={s.editor}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={'#include <stdio.h>\n\nint main() {\n    // your answer here\n    return 0;\n}'}
                rows={8}
                spellCheck={false}
              />
            </div>
            <div style={s.attemptActions}>
              <button style={s.checkBtn} onClick={checkCode} disabled={checking}>
                {checking
                  ? <><span style={s.btnSpin} />Checking...</>
                  : '✓ Check My Code'
                }
              </button>
              <button style={s.hintBtn} onClick={() => askTopic(`Give me a hint about: ${topic}`)}>
                💡 Hint
              </button>
              <button style={s.clearBtn} onClick={() => setCode('')}>✕ Clear</button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={s.feedCard}>
            <div style={s.feedHeader}>
              <span style={{ fontSize: 16, color: 'var(--green)' }}>◈</span>
              <div style={s.feedTitle}>AI Feedback</div>
            </div>
            <div style={s.feedBody}>{renderAI(feedback)}</div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={s.inputBar}>
        <div style={s.inputWrap}>
          <span style={s.inputPre}>◉</span>
          <input
            style={s.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask a follow-up or type any C topic to learn..."
          />
          <button style={s.sendBtn} onClick={send}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  page:           { display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' },
  topbar:         { padding:'13px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg2)', flexShrink:0 },
  topLeft:        { display:'flex', alignItems:'center', gap:12 },
  topIcon:        { width:36, height:36, background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, color:'var(--accent)' },
  topTitle:       { fontFamily:'var(--display)', fontSize:14, fontWeight:700 },
  topSub:         { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)' },
  tabs:           { display:'flex', gap:4, background:'var(--surface)', borderRadius:10, padding:3, border:'1px solid var(--border)' },
  tab:            { padding:'5px 14px', borderRadius:8, fontSize:12, color:'var(--muted)', cursor:'pointer', fontFamily:'var(--mono)' },
  tabActive:      { background:'var(--accent)', color:'white' },
  content:        { flex:1, overflowY:'auto', padding:'18px 22px', display:'flex', flexDirection:'column', gap:16 },
  stepsRow:       { display:'flex', alignItems:'center' },
  stepItem:       { display:'flex', alignItems:'center', gap:10, flex:1, position:'relative' },
  stepCircle:     { width:30, height:30, borderRadius:'50%', background:'var(--surface)', border:'2px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontFamily:'var(--mono)', color:'var(--muted)', flexShrink:0, zIndex:1 },
  stepCircleNow:  { borderColor:'var(--accent)', color:'var(--accent)', background:'rgba(59,130,246,0.1)' },
  stepCircleDone: { borderColor:'var(--green)', color:'var(--green)', background:'rgba(16,185,129,0.1)' },
  stepName:       { fontSize:12, fontWeight:500 },
  stepStatus:     { fontSize:10, fontFamily:'var(--mono)' },
  stepLine:       { position:'absolute', left:40, right:0, top:'50%', transform:'translateY(-50%)', height:2, background:'var(--border)', zIndex:0 },
  stepLineDone:   { background:'linear-gradient(90deg,var(--green),var(--accent2))' },
  welcomeCard:    { background:'var(--card2)', borderRadius:16, border:'1px solid var(--border)', padding:'36px 32px', textAlign:'center', animation:'fadeUp 0.4s ease' },
  welcomeIconWrap:{ marginBottom:16, animation:'float 3s ease-in-out infinite', display:'inline-block' },
  welcomeTitle:   { fontFamily:'var(--display)', fontSize:20, fontWeight:800, marginBottom:8 },
  welcomeSub:     { fontSize:13, color:'var(--muted2)', maxWidth:400, margin:'0 auto 22px', lineHeight:1.7 },
  quickGrid:      { display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' },
  quickChip:      { padding:'7px 16px', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.18)', borderRadius:20, color:'var(--accent)', fontSize:12, cursor:'pointer', fontFamily:'var(--mono)' },
  loadCard:       { background:'var(--card2)', borderRadius:14, border:'1px solid rgba(59,130,246,0.2)', padding:22, display:'flex', alignItems:'center', gap:18, animation:'fadeUp 0.3s ease' },
  loadRing:       { width:38, height:38, border:'3px solid rgba(59,130,246,0.15)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0, display:'inline-block' },
  loadMain:       { fontSize:14, fontWeight:600 },
  loadSub:        { fontSize:12, color:'var(--muted2)', marginTop:3 },
  errorCard:      { background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'13px 18px', color:'var(--red)', fontSize:13 },
  respCard:       { background:'var(--card2)', borderRadius:14, border:'1px solid rgba(59,130,246,0.2)', overflow:'hidden', animation:'fadeUp 0.4s ease' },
  respHeader:     { padding:'11px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(59,130,246,0.04)' },
  aiBadge:        { display:'flex', alignItems:'center', gap:7, fontSize:12, fontWeight:600, color:'var(--accent)', fontFamily:'var(--mono)' },
  aiDot:          { width:8, height:8, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px rgba(16,185,129,0.5)', animation:'pulse-dot 2s ease-in-out infinite', display:'inline-block' },
  respLabel:      { fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)' },
  respBody:       { padding:'16px 18px' },
  para:           { fontSize:13, color:'#CBD5E1', lineHeight:1.75, marginBottom:8 },
  codeWrap:       { borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', margin:'10px 0' },
  codeBar:        { background:'#0D1220', padding:'7px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  codeDots:       { display:'flex', gap:5 },
  dot:            { width:8, height:8, borderRadius:'50%', display:'inline-block' },
  codeLang:       { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)', letterSpacing:'1px' },
  codeBlock:      { background:'#080B12', padding:16, fontSize:12, lineHeight:1.8, overflowX:'auto', color:'#A8D8B9', margin:0, whiteSpace:'pre' },
  attemptCard:    { background:'var(--card2)', borderRadius:14, border:'1px solid var(--border)', overflow:'hidden' },
  attemptHeader:  { padding:'12px 18px', borderBottom:'1px solid var(--border)', background:'rgba(255,255,255,0.02)' },
  attemptTitle:   { fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8 },
  attemptSub:     { fontSize:11, color:'var(--muted)', marginTop:3, fontFamily:'var(--mono)' },
  editorWrap:     { borderBottom:'1px solid var(--border)' },
  editorBar:      { background:'#0D1220', padding:'7px 14px', display:'flex', alignItems:'center', gap:10 },
  editorFile:     { fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)' },
  editor:         { width:'100%', background:'#080B12', border:'none', outline:'none', resize:'vertical', padding:16, color:'#A8D8B9', fontFamily:'var(--mono)', fontSize:12, lineHeight:1.8, minHeight:130, display:'block' },
  attemptActions: { padding:'12px 18px', display:'flex', gap:10, alignItems:'center' },
  checkBtn:       { padding:'8px 20px', background:'linear-gradient(135deg,var(--accent),var(--accent2))', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, cursor:'pointer' },
  btnSpin:        { width:12, height:12, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' },
  hintBtn:        { padding:'8px 16px', background:'rgba(245,158,11,0.1)', color:'var(--gold)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, fontSize:13, cursor:'pointer' },
  clearBtn:       { padding:'8px 14px', background:'rgba(255,255,255,0.04)', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:10, fontSize:12, cursor:'pointer', marginLeft:'auto' },
  feedCard:       { background:'var(--card2)', borderRadius:14, border:'1px solid rgba(16,185,129,0.2)', overflow:'hidden', animation:'fadeUp 0.4s ease' },
  feedHeader:     { padding:'11px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, background:'rgba(16,185,129,0.04)' },
  feedTitle:      { fontSize:12, fontWeight:700, color:'var(--green)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'1px' },
  feedBody:       { padding:'16px 18px' },
  inputBar:       { padding:'13px 22px', borderTop:'1px solid var(--border)', background:'var(--bg2)', flexShrink:0 },
  inputWrap:      { display:'flex', alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' },
  inputPre:       { padding:'0 13px', color:'var(--muted)', fontSize:14 },
  input:          { flex:1, background:'transparent', border:'none', outline:'none', padding:'11px 0', color:'var(--text)', fontSize:13 },
  sendBtn:        { width:42, height:42, background:'linear-gradient(135deg,var(--accent),var(--accent2))', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 },
}