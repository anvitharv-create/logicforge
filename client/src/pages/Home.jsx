import { useNavigate } from 'react-router-dom'

const METRICS = [
  { label:'Topics Mastered', val:'8',   sub:'of 14 total',      color:'var(--green)',   icon:'◈' },
  { label:'Accuracy',        val:'74%', sub:'last 30 sessions',  color:'var(--gold)',    icon:'◎' },
  { label:'Problems Solved', val:'42',  sub:'this week',         color:'var(--accent2)', icon:'⟨/⟩' },
  { label:'Logic Score',     val:'68',  sub:'Level 3 Forger',    color:'var(--accent)',  icon:'▲' },
]

const TOPICS = [
  { name:'Pointers',    steps:5, done:5, status:'complete' },
  { name:'Arrays',      steps:5, done:5, status:'complete' },
  { name:'Recursion',   steps:5, done:2, status:'progress' },
  { name:'Memory Mgmt', steps:6, done:0, status:'new'      },
  { name:'Structs',     steps:4, done:0, status:'new'      },
  { name:'File I/O',    steps:5, done:0, status:'new'      },
]

const WEAK = [
  { name:'Pointer dereferencing', score:42 },
  { name:'Off-by-one errors',     score:51 },
  { name:'Recursive base case',   score:63 },
  { name:'String termination',    score:69 },
]

const ACTIVITY = [
  { color:'green',  text:'Completed Arrays — all 5 steps',        time:'Today, 4:12 PM'     },
  { color:'gold',   text:'Pointer mini-check: 2nd attempt needed', time:'Today, 3:45 PM'     },
  { color:'accent', text:'Started Recursion — Concept done',       time:'Yesterday, 7:30 PM' },
  { color:'muted',  text:'Solved: Sum of array problem',           time:'Yesterday, 6:10 PM' },
]

const STATUS = {
  complete: { label:'Complete',    bg:'rgba(16,185,129,0.12)',  color:'var(--green)'  },
  progress: { label:'In Progress', bg:'rgba(59,130,246,0.12)',  color:'var(--accent)' },
  new:      { label:'Not Started', bg:'rgba(255,255,255,0.05)', color:'var(--muted2)' },
}

const dotColor = c =>
  c==='green'  ? 'var(--green)'  :
  c==='gold'   ? 'var(--gold)'   :
  c==='accent' ? 'var(--accent)' : 'var(--muted)'

// ── Read logged-in user from localStorage ─────────────────────────────────────
function getUser() {
  try {
    const stored = localStorage.getItem('logicforge_user')
    return stored ? JSON.parse(stored) : { name: 'there', email: '' }
  } catch {
    return { name: 'there', email: '' }
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const nav = useNavigate()

  // Get real user data
  const user      = getUser()
  const firstName = user.name.split(' ')[0]
  const initials  = firstName.slice(0, 2).toUpperCase()
  const greeting  = getGreeting()

  return (
    <div style={s.page}>

      {/* Topbar */}
      <div style={s.topbar}>
        <div>
          <div style={s.greeting}>{greeting}, {firstName} 👋</div>
          <div style={s.greetingSub}>Ready to forge some logic today?</div>
        </div>
        <div style={s.topRight}>
          <div style={s.notifBtn}>
            🔔<span style={s.notifDot} />
          </div>
          <div style={s.searchBar}>⌕  Search topics...</div>
          <div style={s.avatarCircle}>{initials}</div>
        </div>
      </div>

      <div style={s.content}>

        {/* Metrics */}
        <div style={s.metricsRow}>
          {METRICS.map((m, i) => (
            <div key={m.label} style={{ ...s.metricCard, animationDelay:`${i * 0.07}s` }}>
              <div style={{ fontSize:18, color:m.color, marginBottom:10 }}>{m.icon}</div>
              <div style={{ ...s.metricVal, color:m.color }}>{m.val}</div>
              <div style={s.metricLabel}>{m.label}</div>
              <div style={s.metricSub}>{m.sub}</div>
              <div style={{ ...s.metricGlow, background:m.color }} />
            </div>
          ))}
        </div>

        {/* Topics + right column */}
        <div style={s.twoPane}>

          <div>
            <div style={s.paneHeader}>
              <div style={s.paneTitle}>Continue Learning</div>
              <button style={s.viewAll} onClick={() => nav('/learn')}>View all →</button>
            </div>
            <div style={s.topicsGrid}>
              {TOPICS.map(t => {
                const meta = STATUS[t.status]
                const pct  = (t.done / t.steps) * 100
                return (
                  <div key={t.name} style={s.topicCard} onClick={() => nav('/learn')}>
                    <div style={s.topicRow}>
                      <span style={s.topicName}>{t.name}</span>
                      <span style={{ ...s.topicBadge, background:meta.bg, color:meta.color }}>
                        {meta.label}
                      </span>
                    </div>
                    <div style={s.topicBarBg}>
                      <div style={{
                        ...s.topicBarFill,
                        width: `${pct}%`,
                        background:
                          t.status === 'complete' ? 'var(--green)' :
                          t.status === 'progress' ? 'linear-gradient(90deg,var(--accent),var(--accent2))' :
                          'var(--muted)'
                      }} />
                    </div>
                    <div style={s.topicMeta}>{t.done}/{t.steps} steps · {Math.round(pct)}%</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={s.rightCol}>

            {/* Weak areas */}
            <div style={s.card}>
              <div style={s.cardTitle}>⚠ Weak Areas</div>
              {WEAK.map(w => (
                <div key={w.name} style={s.weakRow}>
                  <span style={s.weakName}>{w.name}</span>
                  <div style={s.weakRight}>
                    <div style={s.weakBarBg}>
                      <div style={{
                        ...s.weakBarFill,
                        width: `${w.score}%`,
                        background: w.score < 55 ? 'var(--red)' : 'var(--gold)'
                      }} />
                    </div>
                    <span style={{ ...s.weakScore, color: w.score < 55 ? 'var(--red)' : 'var(--gold)' }}>
                      {w.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <div style={s.card}>
              <div style={s.cardTitle}>⟳ Recent Activity</div>
              {ACTIVITY.map((a, i) => (
                <div key={i} style={s.actRow}>
                  <div style={{ ...s.actDot, background: dotColor(a.color) }} />
                  <div>
                    <div style={s.actText}>{a.text}</div>
                    <div style={s.actTime}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Quick start */}
        <div>
          <div style={s.quickTitle}>Quick Start</div>
          <div style={s.quickRow}>
            {[
              { label:'→ Resume Recursion',    accent:true,  fn:()=>nav('/learn')    },
              { label:'⟨/⟩ Drill Weak Areas', accent:false, fn:()=>nav('/practice') },
              { label:'◉ Start Memory Mgmt',   accent:false, fn:()=>nav('/learn')    },
            ].map(b => (
              <button
                key={b.label}
                style={{ ...s.quickBtn, ...(b.accent ? s.quickAccent : {}) }}
                onClick={b.fn}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

const s = {
  page:        { display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' },
  topbar:      { padding:'16px 26px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg2)', flexShrink:0 },
  greeting:    { fontFamily:'var(--display)', fontSize:17, fontWeight:700 },
  greetingSub: { fontSize:12, color:'var(--muted2)', marginTop:2 },
  topRight:    { display:'flex', alignItems:'center', gap:12 },
  notifBtn:    { position:'relative', width:36, height:36, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:15 },
  notifDot:    { position:'absolute', top:6, right:6, width:7, height:7, background:'var(--red)', borderRadius:'50%', border:'1.5px solid var(--bg2)' },
  searchBar:   { padding:'8px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, color:'var(--muted)', fontSize:12, cursor:'pointer', minWidth:170 },
  avatarCircle:{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,var(--accent),var(--accent2))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white', flexShrink:0 },
  content:     { flex:1, overflowY:'auto', padding:'22px 26px', display:'flex', flexDirection:'column', gap:22 },
  metricsRow:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  metricCard:  { background:'var(--card2)', borderRadius:14, padding:18, border:'1px solid var(--border)', position:'relative', overflow:'hidden', animation:'fadeUp 0.5s ease both', cursor:'default' },
  metricVal:   { fontFamily:'var(--display)', fontSize:28, fontWeight:800, lineHeight:1 },
  metricLabel: { fontSize:12, fontWeight:500, marginTop:6 },
  metricSub:   { fontSize:11, color:'var(--muted)', marginTop:2 },
  metricGlow:  { position:'absolute', bottom:-20, right:-20, width:60, height:60, borderRadius:'50%', opacity:0.08, filter:'blur(20px)' },
  twoPane:     { display:'grid', gridTemplateColumns:'1fr 320px', gap:20 },
  paneHeader:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 },
  paneTitle:   { fontFamily:'var(--display)', fontSize:14, fontWeight:700 },
  viewAll:     { fontSize:12, color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--mono)' },
  topicsGrid:  { display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 },
  topicCard:   { background:'var(--card2)', borderRadius:12, padding:14, border:'1px solid var(--border)', cursor:'pointer' },
  topicRow:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
  topicName:   { fontSize:13, fontWeight:600 },
  topicBadge:  { fontSize:10, padding:'2px 8px', borderRadius:20, fontFamily:'var(--mono)' },
  topicBarBg:  { height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden', marginBottom:8 },
  topicBarFill:{ height:'100%', borderRadius:2 },
  topicMeta:   { fontSize:10, color:'var(--muted)', fontFamily:'var(--mono)' },
  rightCol:    { display:'flex', flexDirection:'column', gap:14 },
  card:        { background:'var(--card2)', borderRadius:14, padding:'14px 16px', border:'1px solid var(--border)' },
  cardTitle:   { fontSize:11, fontWeight:600, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:'var(--mono)', marginBottom:12 },
  weakRow:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid var(--border)' },
  weakName:    { fontSize:12, color:'var(--muted2)', flex:1 },
  weakRight:   { display:'flex', alignItems:'center', gap:8 },
  weakBarBg:   { width:60, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' },
  weakBarFill: { height:'100%', borderRadius:2 },
  weakScore:   { fontSize:12, fontWeight:600, fontFamily:'var(--mono)', minWidth:30, textAlign:'right' },
  actRow:      { display:'flex', gap:10, padding:'6px 0', borderBottom:'1px solid var(--border)' },
  actDot:      { width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:4 },
  actText:     { fontSize:12, color:'var(--muted2)', lineHeight:1.5 },
  actTime:     { fontSize:10, color:'var(--muted)', marginTop:2, fontFamily:'var(--mono)' },
  quickTitle:  { fontFamily:'var(--display)', fontSize:13, fontWeight:700, color:'var(--muted2)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 },
  quickRow:    { display:'flex', gap:10, flexWrap:'wrap' },
  quickBtn:    { padding:'9px 18px', background:'var(--surface)', color:'var(--muted2)', border:'1px solid var(--border)', borderRadius:10, fontSize:13, fontWeight:500, fontFamily:'var(--mono)', cursor:'pointer' },
  quickAccent: { background:'rgba(59,130,246,0.1)', color:'var(--accent)', border:'1px solid rgba(59,130,246,0.25)' },
}