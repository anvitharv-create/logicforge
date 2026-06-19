import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const NAV = [
  { to:'/home',     icon:'⌂',    label:'Home',     sub:'Dashboard' },
  { to:'/learn',    icon:'◉',    label:'Learn',    sub:'AI Tutor'  },
  { to:'/practice', icon:'⟨/⟩', label:'Practice', sub:'Coding'    },
]

const TOPICS = [
  { label:'Pointers',  done:true  },
  { label:'Arrays',    done:true  },
  { label:'Recursion', done:false },
  { label:'Memory',    done:false },
  { label:'Structs',   done:false },
]

// ── Read real logged-in user from localStorage ────────────────────────────────
function getUser() {
  try {
    const stored = localStorage.getItem('logicforge_user')
    return stored ? JSON.parse(stored) : { name: 'User', email: '' }
  } catch {
    return { name: 'User', email: '' }
  }
}

export default function Sidebar() {
  const user      = getUser()
  const firstName = user.name.split(' ')[0]
  const initials  = firstName.slice(0, 2).toUpperCase()

  return (
    <aside style={s.sidebar}>

      {/* Brand / Logo */}
      <div style={s.brand}>
        <div style={{ animation:'float 3s ease-in-out infinite', flexShrink:0 }}>
          <Logo size={34} />
        </div>
        <div>
          <div style={s.brandName}>LogicForge</div>
          <div style={s.brandTag}>C Programming AI</div>
        </div>
      </div>

      <div style={s.divider} />

      {/* Navigation */}
      <div style={s.section}>
        <div style={s.secLabel}>Navigation</div>
        {NAV.map(n => (
          <NavLink
            key={n.to}
            to={n.to}
            style={({ isActive }) => ({
              ...s.navItem,
              ...(isActive ? s.navActive : {})
            })}
          >
            <span style={s.navIcon}>{n.icon}</span>
            <div style={{ flex:1 }}>
              <div style={s.navMain}>{n.label}</div>
              <div style={s.navSub}>{n.sub}</div>
            </div>
            <span style={s.navArrow}>›</span>
          </NavLink>
        ))}
      </div>

      <div style={s.divider} />

      {/* C Topics */}
      <div style={s.section}>
        <div style={s.secLabel}>C Topics</div>
        {TOPICS.map(t => (
          <div key={t.label} style={s.topicRow}>
            <span style={{ ...s.topicDot, ...(t.done ? s.dotDone : {}) }} />
            <span style={s.topicLabel}>{t.label}</span>
            {t.done && <span style={s.topicCheck}>✓</span>}
          </div>
        ))}
      </div>

      {/* Streak */}
      <div style={s.streakCard}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <span style={{ fontSize:22 }}>🔥</span>
          <div>
            <div style={s.streakNum}>7</div>
            <div style={s.streakLbl}>day streak</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {[1,2,3,4,5,6,7].map(d => (
            <div key={d} style={{ ...s.streakDay, ...s.streakDayOn }} />
          ))}
        </div>
      </div>

      {/* User card — now shows real name */}
      <div style={s.userCard}>
        <div style={s.avatar}>{initials}</div>
        <div style={{ flex:1 }}>
          <div style={s.userName}>{firstName}</div>
          <div style={s.userLevel}>Level 3 Forger</div>
        </div>
        <div style={s.onlineDot} />
      </div>

    </aside>
  )
}

const s = {
  sidebar:    { width:220, minHeight:'100vh', background:'var(--bg2)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0 },
  brand:      { display:'flex', alignItems:'center', gap:11, padding:'22px 16px 18px' },
  brandName:  { fontFamily:'var(--display)', fontSize:15, fontWeight:800, color:'var(--text)', letterSpacing:-0.3 },
  brandTag:   { fontSize:9, color:'var(--accent2)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:2, fontFamily:'var(--mono)' },
  divider:    { height:1, background:'var(--border)', margin:'0 16px', flexShrink:0 },
  section:    { padding:'12px 10px 6px' },
  secLabel:   { fontSize:10, color:'var(--muted)', letterSpacing:'1.2px', textTransform:'uppercase', padding:'0 8px', marginBottom:6, fontFamily:'var(--mono)' },
  navItem:    { display:'flex', alignItems:'center', gap:9, padding:'8px 10px', borderRadius:10, color:'var(--muted2)', marginBottom:2, fontSize:13, textDecoration:'none', cursor:'pointer' },
  navActive:  { background:'rgba(59,130,246,0.12)', color:'var(--text)', border:'1px solid rgba(59,130,246,0.2)' },
  navIcon:    { fontSize:15, width:20, textAlign:'center', flexShrink:0 },
  navMain:    { fontSize:13, fontWeight:500, lineHeight:1 },
  navSub:     { fontSize:10, color:'var(--muted)' },
  navArrow:   { fontSize:14, color:'var(--muted)' },
  topicRow:   { display:'flex', alignItems:'center', gap:8, padding:'5px 10px', borderRadius:7 },
  topicDot:   { width:7, height:7, borderRadius:'50%', background:'var(--muted)', flexShrink:0 },
  dotDone:    { background:'var(--green)', boxShadow:'0 0 6px rgba(16,185,129,0.4)' },
  topicLabel: { fontSize:12, color:'var(--muted2)', flex:1 },
  topicCheck: { fontSize:10, color:'var(--green)' },
  streakCard: { margin:'10px 12px', background:'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(6,182,212,0.07))', border:'1px solid rgba(59,130,246,0.15)', borderRadius:12, padding:'12px 14px' },
  streakNum:  { fontFamily:'var(--display)', fontSize:22, fontWeight:800, color:'var(--gold)', lineHeight:1 },
  streakLbl:  { fontSize:10, color:'var(--muted2)' },
  streakDay:  { flex:1, height:4, background:'rgba(255,255,255,0.07)', borderRadius:2 },
  streakDayOn:{ background:'linear-gradient(90deg,var(--accent),var(--accent2))', boxShadow:'0 0 4px rgba(59,130,246,0.4)' },
  userCard:   { margin:'8px 12px 18px', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'var(--surface)', borderRadius:10, border:'1px solid var(--border)' },
  avatar:     { width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 },
  userName:   { fontSize:13, fontWeight:500 },
  userLevel:  { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)' },
  onlineDot:  { width:8, height:8, borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 6px rgba(16,185,129,0.5)', animation:'pulse-dot 2s ease-in-out infinite' },
}