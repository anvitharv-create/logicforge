import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Signup() {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const nav = useNavigate()

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Signup failed')
      localStorage.setItem('logicforge_user', JSON.stringify(data.user))
      nav('/home')
    } catch (err) {
      setError(err.message || 'Signup failed. Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow1} />

      <div style={s.card}>
        <div style={s.brandRow}>
          <Logo size={42} />
          <div>
            <div style={s.brandName}>LogicForge</div>
            <div style={s.brandSub}>C Programming AI Tutor</div>
          </div>
        </div>

        <h1 style={s.heading}>Start learning</h1>
        <p style={s.sub}>Free forever — no credit card needed</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSignup} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Name</label>
            <div style={s.inputBox}>
              <span style={s.inputIcon}>◈</span>
              <input style={s.input} type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Email</label>
            <div style={s.inputBox}>
              <span style={s.inputIcon}>✉</span>
              <input style={s.input} type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required />
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.inputBox}>
              <span style={s.inputIcon}>◎</span>
              <input style={s.input} type="password"
                placeholder="min 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required />
            </div>
          </div>

          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? <span style={s.spinner} /> : 'Create Account →'}
          </button>
        </form>

        <p style={s.loginText}>
          Already have an account?{' '}
          <Link to="/" style={s.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  page:      { minHeight:'100vh', width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden', background:'var(--bg)' },
  bgGrid:    { position:'fixed', inset:0, zIndex:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)', backgroundSize:'40px 40px' },
  bgGlow1:   { position:'fixed', top:-200, left:'50%', transform:'translateX(-50%)', width:600, height:600, zIndex:0, pointerEvents:'none', background:'radial-gradient(ellipse,rgba(59,130,246,0.08) 0%,transparent 70%)' },
  card:      { position:'relative', zIndex:1, width:'100%', maxWidth:400, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:20, padding:32, boxShadow:'0 20px 60px rgba(0,0,0,0.4)', animation:'fadeUp 0.5s ease' },
  brandRow:  { display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:24 },
  brandName: { fontFamily:'var(--display)', fontSize:18, fontWeight:800 },
  brandSub:  { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)', letterSpacing:'1px' },
  heading:   { fontFamily:'var(--display)', fontSize:22, fontWeight:800, textAlign:'center', marginBottom:6 },
  sub:       { fontSize:13, color:'var(--muted2)', textAlign:'center', marginBottom:20 },
  errorBox:  { background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', color:'var(--red)', fontSize:13, marginBottom:16 },
  form:      { display:'flex', flexDirection:'column', gap:16, marginBottom:20 },
  field:     { display:'flex', flexDirection:'column', gap:6 },
  label:     { fontSize:11, fontWeight:600, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:'var(--mono)' },
  inputBox:  { display:'flex', alignItems:'center', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' },
  inputIcon: { padding:'0 12px', color:'var(--muted)', fontSize:14 },
  input:     { flex:1, background:'transparent', border:'none', outline:'none', padding:'11px 12px 11px 0', color:'var(--text)', fontSize:13 },
  btn:       { padding:12, background:'linear-gradient(135deg,var(--accent),var(--accent2))', color:'white', border:'none', borderRadius:10, fontSize:14, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', marginTop:4, cursor:'pointer' },
  spinner:   { width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.8s linear infinite' },
  loginText: { textAlign:'center', fontSize:13, color:'var(--muted)' },
  link:      { color:'var(--accent)' },
}