
import { Routes, Route, NavLink } from 'react-router-dom'
import CommentsDashboard from './pages/CommentsDashboard'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <nav className="nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<CommentsDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Front-End Assignment</footer>
    </div>
  )
}
