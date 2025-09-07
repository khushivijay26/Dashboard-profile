
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let ignore = false
    async function fetchUser() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users')
        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        if (!ignore) {
          setUser(data[0])
          setLoading(false)
        }
      } catch (e) {
        if (!ignore) { setError(e.message || 'Error'); setLoading(false) }
      }
    }
    fetchUser()
    return () => { ignore = true }
  }, [])

  if (loading) return <div className="card">Loading profile…</div>
  if (error) return <div className="card">Error: {error}</div>

  return (
    <div className="card" aria-live="polite">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
        <h1 style={{ margin: 0 }}>Profile</h1>
        <button className="btn" onClick={() => navigate('/')}>← Back to Dashboard</button>
      </div>
      {user && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '.25rem' }}>
            <span className="badge">User ID: {user.id}</span>
            <h2 style={{ margin: '0.25rem 0' }}>{user.name} <span style={{ color: '#94a3b8' }}>@{user.username}</span></h2>
            <div style={{ color: '#94a3b8' }}>{user.email} · {user.phone} · {user.website}</div>
          </div>
          <div style={{ display: 'grid', gap: '.25rem' }}>
            <strong>Address</strong>
            <div style={{ color: '#94a3b8' }}>{user.address.suite}, {user.address.street}, {user.address.city} - {user.address.zipcode}</div>
          </div>
          <div style={{ display: 'grid', gap: '.25rem' }}>
            <strong>Company</strong>
            <div style={{ color: '#94a3b8' }}>{user.company.name}</div>
            <div style={{ color: '#94a3b8' }}>{user.company.catchPhrase}</div>
          </div>
        </div>
      )}
    </div>
  )
}
