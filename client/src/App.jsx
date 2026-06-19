import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Practice from './pages/Practice'

const AUTH_PAGES = ['/', '/signup']

export default function App() {
  const { pathname } = useLocation()
  const isAuth = AUTH_PAGES.includes(pathname)

  if (isAuth) {
    return (
      <Routes>
        <Route path="/"       element={<Login />}  />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    )
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar />
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <Routes>
          <Route path="/home"     element={<Home />}     />
          <Route path="/learn"    element={<Learn />}    />
          <Route path="/practice" element={<Practice />} />
          <Route path="*"         element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </div>
  )
}