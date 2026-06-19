import { useState } from 'react'
import axios from 'axios'

const PROBLEMS = [
  { id:1, name:'Dereference & print', topic:'Pointers', diff:'Easy',   status:'attempted', mins:5,  desc:'Declare int score = 95. Create a pointer to it. Print using the variable directly AND using pointer dereferencing. Both must output 95.' },
  { id:2, name:'Swap using pointers', topic:'Pointers', diff:'Medium', status:'new',       mins:10, desc:'Write swap(int *a, int *b) that swaps two integers using pointers. Test in main with x=10, y=20. Print values before and after.' },
  { id:3, name:'Sum of array',        topic:'Arrays',   diff:'Easy',   status:'solved',    mins:5,  desc:'Write a C function that takes an integer array and its length, returns the sum. Test with {1,2,3,4,5}. Expected output: 15.' },
  { id:4, name:'Reverse an array',    topic:'Arrays',   diff:'Medium', status:'solved',    mins:8,  desc:'Reverse an integer array in-place without a second array. Test with {1,2,3,4,5} and print the reversed result.' },
  { id:5, name:'Fibonacci recursive', topic:'Recursion',diff:'Hard',   status:'locked',    mins:15, desc:'Locked — complete Recursion topic in Learn first.' },
  { id:6, name:'malloc & free cycle', topic:'Memory',   diff:'Hard',   status:'locked',    mins:20, desc:'Locked — complete Memory topic in Learn first.' },
]

const DIFF = {
  Easy:   { bg:'rgba(16,185,129,0.1)',  color:'var(--green)' },
  Medium: { bg:'rgba(245,158,11,0.1)',  color:'var(--gold)'  },
  Hard:   { bg:'rgba(239,68,68,0.1)',   color:'var(--red)'   },
}

const FILTERS = ['All','Pointers','Arrays','Weak areas']

function STATUS_ICON(st) {
  if (st==='solved')   return { icon:'✓', color:'var(--green)' }
  if (st==='attempted')return { icon:'⟳', color:'var(--gold)'  }
  if (st==='locked')   return { icon:'🔒', color:'var(--muted)' }
  return { icon:'○', color:'var(--muted)' }
}

function renderAI(text) {
  return text.split(/(```[\s\S]*?```)/g).map((p,i)=>{
    if (p.startsWith('```')) {
      const code = p.replace(/```\w*\n?/,'').replace(/```$/,'')
      return <pre key={i} style={s.codeBlock}><code>{code}</code></pre>
    }
    return p.split('\n').filter(l=>l.trim()).map((line,j)=>(
      <p key={`${i}-${j}`} style={s.para}>{line}</p>
    ))
  })
}

export default function Practice() {
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState(PROBLEMS[0])
  const [code,     setCode]     = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading,  setLoading]  = useState(false)

  const filtered = filter==='All'        ? PROBLEMS
    : filter==='Weak areas' ? PROBLEMS.filter(p=>p.status==='attempted')
    : PROBLEMS.filter(p=>p.topic===filter)

  async function submit() {
    if (!code.trim()) return
    setLoading(true); setFeedback(null)
    try {
      const r = await axios.post('/api/ai/evaluate', { problem:selected.name, topic:selected.topic, code })
      setFeedback(r.data)
    } catch(e) {
      setFeedback({ score:0, summary:'Evaluation failed. Is the backend running on port 5000?', checks:[] })
    }
    setLoading(false)
  }

  function pick(p) {
    if (p.status==='locked') return
    setSelected(p); setCode(''); setFeedback(null)
  }

  return (
    <div style={s.page}>
      {/* Topbar */}
      <div style={s.topbar}>
        <div style={s.topLeft}>
          <div style={s.topIcon}>⟨/⟩</div>
          <div>
            <div style={s.topTitle}>Practice Arena</div>
            <div style={s.topSub}>Solve. Submit. Improve.</div>
          </div>
        </div>
        <div style={s.filters}>
          {FILTERS.map(f=>(
            <button key={f} style={{...s.filter,...(filter===f?s.filterOn:{})}} onClick={()=>setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={s.body}>
        {/* Problem list */}
        <div style={s.list}>
          <div style={s.listMeta}>{filtered.length} problems</div>
          {filtered.map(p => {
            const st = STATUS_ICON(p.status)
            return (
              <div
                key={p.id}
                style={{
                  ...s.probCard,
                  ...(selected.id===p.id ? s.probSelected : {}),
                  ...(p.status==='locked' ? s.probLocked : {}),
                }}
                onClick={()=>pick(p)}
              >
                <div style={s.probTop}>
                  <span style={s.probName}>{p.name}</span>
                  <span style={{...s.diffBadge,...DIFF[p.diff]}}>{p.diff}</span>
                </div>
                <div style={s.probMeta}>
                  <span style={s.probTopic}>{p.topic}</span>
                  <span style={s.probMins}>⏱ {p.mins}min</span>
                </div>
                <div style={{...s.probStatus, color:st.color}}>
                  {st.icon} {p.status.charAt(0).toUpperCase()+p.status.slice(1)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Editor panel */}
        <div style={s.editorPanel}>
          <div style={s.probHeader}>
            <div style={s.probTitle}>{selected.name}</div>
            <div style={s.probHeaderMeta}>
              <span style={s.metaChip}>{selected.topic}</span>
              <span style={s.metaChip}>⏱ {selected.mins} min</span>
              <span style={{...s.metaChip,...DIFF[selected.diff]}}>{selected.diff}</span>
            </div>
          </div>

          <div style={s.editorContent}>
            {/* Description */}
            <div style={s.descCard}>
              <div style={s.descLabel}>Problem</div>
              <div style={s.descText}>{selected.desc}</div>
            </div>

            {/* Code area */}
            <div style={s.codeSection}>
              <div style={s.codeTopBar}>
                <div style={s.codeDots}>
                  <span style={{...s.dot,background:'#EF4444'}}/>
                  <span style={{...s.dot,background:'#F59E0B'}}/>
                  <span style={{...s.dot,background:'#10B981'}}/>
                </div>
                <span style={s.codeFile}>solution.c</span>
                <span style={s.codeLang}>C</span>
              </div>
              <textarea
                style={{...s.codeArea,...(selected.status==='locked'?{opacity:0.4,cursor:'not-allowed'}:{})}}
                value={code}
                onChange={e=>setCode(e.target.value)}
                placeholder={'#include <stdio.h>\n\nint main() {\n    // your solution here\n    return 0;\n}'}
                rows={9}
                disabled={selected.status==='locked'}
                spellCheck={false}
              />
            </div>

            {/* Loading */}
            {loading && (
              <div style={s.evalLoading}>
                <span style={s.evalSpinner}/>
                Evaluating your code with AI...
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div style={s.feedBox}>
                <div style={s.feedHeader}>
                  <div style={s.feedTitle}>AI Evaluation</div>
                  <div style={s.scoreWrap}>
                    <span style={s.scoreNum}>{feedback.score}</span>
                    <span style={s.scoreOf}>/100</span>
                  </div>
                </div>
                <p style={s.feedSummary}>{feedback.summary}</p>
                <div style={s.checks}>
                  {feedback.checks?.map((c,i)=>(
                    <div key={i} style={s.checkRow}>
                      <span style={{color:c.ok?'var(--green)':c.warn?'var(--gold)':'var(--red)',flexShrink:0}}>
                        {c.ok?'✓':c.warn?'⚠':'✗'}
                      </span>
                      <span style={s.checkText}>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action bar */}
          <div style={s.actions}>
            <button style={s.submitBtn}
              onClick={submit}
              disabled={loading||selected.status==='locked'}>
              {loading
                ? <><span style={s.btnSpin}/>Evaluating...</>
                : '▶ Submit Solution'
              }
            </button>
            <button style={s.clearBtn} onClick={()=>{setCode('');setFeedback(null)}}>Clear</button>
            <button style={s.nextBtn} onClick={()=>{
              const n = PROBLEMS.find(p=>p.id===selected.id+1)
              if (n && n.status!=='locked') pick(n)
            }}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  page:       { display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)' },
  topbar:     { padding:'13px 22px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg2)', flexShrink:0 },
  topLeft:    { display:'flex', alignItems:'center', gap:12 },
  topIcon:    { width:36, height:36, background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--accent2)', fontFamily:'var(--mono)' },
  topTitle:   { fontFamily:'var(--display)', fontSize:14, fontWeight:700 },
  topSub:     { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)' },
  filters:    { display:'flex', gap:5 },
  filter:     { padding:'5px 14px', background:'transparent', border:'1px solid var(--border)', borderRadius:20, color:'var(--muted)', fontSize:12, cursor:'pointer', fontFamily:'var(--mono)' },
  filterOn:   { background:'var(--accent)', color:'white', border:'1px solid var(--accent)' },
  body:       { flex:1, display:'flex', overflow:'hidden' },
  list:       { width:245, borderRight:'1px solid var(--border)', overflowY:'auto', padding:12, flexShrink:0 },
  listMeta:   { fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)', padding:'4px 4px 10px' },
  probCard:   { background:'var(--card2)', borderRadius:10, padding:12, border:'1px solid var(--border)', marginBottom:8, cursor:'pointer' },
  probSelected:{ borderColor:'var(--accent)', background:'rgba(59,130,246,0.05)' },
  probLocked: { opacity:0.45, cursor:'default' },
  probTop:    { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 },
  probName:   { fontSize:12, fontWeight:600 },
  diffBadge:  { fontSize:10, padding:'2px 7px', borderRadius:8, fontFamily:'var(--mono)' },
  probMeta:   { display:'flex', justifyContent:'space-between', marginBottom:5 },
  probTopic:  { fontSize:11, color:'var(--muted2)' },
  probMins:   { fontSize:10, color:'var(--muted)', fontFamily:'var(--mono)' },
  probStatus: { fontSize:11, fontFamily:'var(--mono)' },
  editorPanel:{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  probHeader: { padding:'13px 20px', borderBottom:'1px solid var(--border)', flexShrink:0 },
  probTitle:  { fontFamily:'var(--display)', fontSize:15, fontWeight:700, marginBottom:8 },
  probHeaderMeta:{ display:'flex', gap:8 },
  metaChip:   { fontSize:11, padding:'3px 10px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:6, color:'var(--muted2)', fontFamily:'var(--mono)' },
  editorContent:{ flex:1, overflowY:'auto', padding:'14px 20px', display:'flex', flexDirection:'column', gap:12 },
  descCard:   { background:'var(--card2)', borderRadius:12, padding:'14px 16px', border:'1px solid var(--border)' },
  descLabel:  { fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:'var(--mono)', marginBottom:8 },
  descText:   { fontSize:13, color:'#CBD5E1', lineHeight:1.75 },
  codeSection:{ borderRadius:12, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)' },
  codeTopBar: { background:'#0D1220', padding:'7px 14px', display:'flex', alignItems:'center', gap:10 },
  codeDots:   { display:'flex', gap:5 },
  dot:        { width:8, height:8, borderRadius:'50%', display:'inline-block' },
  codeFile:   { fontSize:11, color:'var(--muted)', fontFamily:'var(--mono)', flex:1 },
  codeLang:   { fontSize:10, color:'var(--accent2)', fontFamily:'var(--mono)', letterSpacing:'1px' },
  codeArea:   { width:'100%', background:'#080B12', border:'none', outline:'none', resize:'vertical', padding:16, color:'#A8D8B9', fontFamily:'var(--mono)', fontSize:12, lineHeight:1.8, minHeight:160, display:'block' },
  evalLoading:{ display:'flex', alignItems:'center', gap:12, background:'rgba(59,130,246,0.05)', border:'1px solid rgba(59,130,246,0.15)', borderRadius:12, padding:14, fontSize:13, color:'var(--accent)' },
  evalSpinner:{ width:16, height:16, border:'2px solid rgba(59,130,246,0.2)', borderTopColor:'var(--accent)', borderRadius:'50%', animation:'spin 0.8s linear infinite', flexShrink:0, display:'inline-block' },
  feedBox:    { background:'var(--card2)', borderRadius:12, border:'1px solid rgba(16,185,129,0.2)', overflow:'hidden', animation:'fadeUp 0.3s ease' },
  feedHeader: { padding:'11px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(16,185,129,0.04)' },
  feedTitle:  { fontSize:12, fontWeight:700, color:'var(--green)', fontFamily:'var(--mono)', textTransform:'uppercase', letterSpacing:'1px' },
  scoreWrap:  { display:'flex', alignItems:'baseline', gap:2 },
  scoreNum:   { fontFamily:'var(--display)', fontSize:22, fontWeight:800, color:'var(--green)' },
  scoreOf:    { fontSize:12, color:'var(--muted)' },
  feedSummary:{ padding:'10px 16px 6px', fontSize:13, color:'#CBD5E1', lineHeight:1.6 },
  checks:     { padding:'0 16px 12px', display:'flex', flexDirection:'column', gap:6 },
  checkRow:   { display:'flex', gap:10, padding:'5px 0', borderBottom:'1px solid var(--border)' },
  checkText:  { fontSize:12, color:'#94A3B8', lineHeight:1.5 },
  para:       { fontSize:13, color:'#CBD5E1', lineHeight:1.75, marginBottom:6 },
  codeBlock:  { background:'#080B12', padding:14, fontSize:12, lineHeight:1.8, overflowX:'auto', color:'#A8D8B9', margin:0 },
  actions:    { padding:'12px 20px', borderTop:'1px solid var(--border)', background:'var(--bg2)', display:'flex', gap:10, flexShrink:0 },
  submitBtn:  { padding:'9px 22px', background:'linear-gradient(135deg,var(--accent),var(--accent2))', color:'white', border:'none', borderRadius:10, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, cursor:'pointer' },
  btnSpin:    { width:12, height:12, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.8s linear infinite', display:'inline-block' },
  clearBtn:   { padding:'9px 16px', background:'rgba(255,255,255,0.04)', color:'var(--muted)', border:'1px solid var(--border)', borderRadius:10, fontSize:13, cursor:'pointer' },
  nextBtn:    { padding:'9px 16px', background:'rgba(6,182,212,0.08)', color:'var(--accent2)', border:'1px solid rgba(6,182,212,0.18)', borderRadius:10, fontSize:13, marginLeft:'auto', cursor:'pointer' },
}