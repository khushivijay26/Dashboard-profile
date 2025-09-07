import React, { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'comments-dashboard-state-v1'
const PAGE_SIZE_OPTIONS = [10, 50, 100]

export default function CommentsDashboard() {
  const loadSavedState = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    } catch {
      return {}
    }
  }

  const savedState = loadSavedState()

  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [currentPage, setCurrentPage] = useState(savedState.currentPage || 1)
  const [rowsPerPage, setRowsPerPage] = useState(savedState.rowsPerPage || 10)
  const [filterName, setFilterName] = useState(savedState.filterName || '')
  const [filterEmail, setFilterEmail] = useState(savedState.filterEmail || '')
  const [filterPhone, setFilterPhone] = useState(savedState.filterPhone || '')
  const [sortColumn, setSortColumn] = useState(savedState.sortColumn || null)
  const [sortDirection, setSortDirection] = useState(savedState.sortDirection || null)

  useEffect(() => {
    let cancel = false
    async function fetchData() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/comments')
        if (!res.ok) throw new Error('Failed to fetch comments')
        const json = await res.json()
        if (!cancel) {
          const normalized = json.map(comment => ({ ...comment, phone: '' }))
          setComments(normalized)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancel) {
          setFetchError(err.message || 'Error')
          setIsLoading(false)
        }
      }
    }
    fetchData()
    return () => { cancel = true }
  }, [])

  useEffect(() => {
    const state = { currentPage, rowsPerPage, filterName, filterEmail, filterPhone, sortColumn, sortDirection }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [currentPage, rowsPerPage, filterName, filterEmail, filterPhone, sortColumn, sortDirection])

  const filteredComments = useMemo(() => {
    const name = filterName.trim().toLowerCase()
    const email = filterEmail.trim().toLowerCase()
    const phone = filterPhone.trim().toLowerCase()

    return comments.filter(c => {
      const matchName = !name || c.name.toLowerCase().includes(name)
      const matchEmail = !email || c.email.toLowerCase().includes(email)
      const matchPhone = !phone || (c.phone || '').toLowerCase().includes(phone)
      return matchName && matchEmail && matchPhone
    })
  }, [comments, filterName, filterEmail, filterPhone])

  const sortedComments = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredComments

    const commentsCopy = [...filteredComments]

    commentsCopy.sort((firstComment, secondComment) => {
      const firstValue = firstComment[sortColumn]
      const secondValue = secondComment[sortColumn]

      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return sortDirection === 'asc'
          ? firstValue - secondValue
          : secondValue - firstValue
      }

      const firstText = String(firstValue).toLowerCase()
      const secondText = String(secondValue).toLowerCase()

      if (firstText < secondText) return sortDirection === 'asc' ? -1 : 1
      if (firstText > secondText) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return commentsCopy
  }, [filteredComments, sortColumn, sortDirection])


  const totalRecords = sortedComments.length
  const totalPages = Math.max(1, Math.ceil(totalRecords / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * rowsPerPage
  const visibleComments = sortedComments.slice(startIndex, startIndex + rowsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 500)

  function toggleSort(column) {
    if (sortColumn !== column) {
      setSortColumn(column)
      setSortDirection('asc')
      return
    }
    if (sortDirection === 'asc') setSortDirection('desc')
    else if (sortDirection === 'desc') { setSortColumn(null); setSortDirection(null) }
    else setSortDirection('asc')
  }

  function SortIcon({ column }) {
    if (sortColumn !== column || !sortDirection) return <span aria-hidden>↕</span>
    return <span aria-hidden>{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  if (isLoading) return <div className="card">Loading comments…</div>
  if (fetchError) return <div className="card">Error: {fetchError}</div>

  return (
    <section className="card" aria-live="polite">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
        <h1 style={{ margin: 0 }}>Comments Dashboard</h1>
        <span className="badge">{totalRecords} records</span>
      </div>

      <div className="toolbar">
        <input className="input" placeholder="Search name…" value={filterName} onChange={e => { setCurrentPage(1); setFilterName(e.target.value) }} />
        <input className="input" placeholder="Search email…" value={filterEmail} onChange={e => { setCurrentPage(1); setFilterEmail(e.target.value) }} />
        <input className="input" placeholder="Search phone… (not in API)" value={filterPhone} onChange={e => { setCurrentPage(1); setFilterPhone(e.target.value) }} />
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <span className="badge">Rows per page</span>
          <select className="select" value={rowsPerPage} onChange={e => { setCurrentPage(1); setRowsPerPage(Number(e.target.value)) }}>
            {PAGE_SIZE_OPTIONS.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="grid">
          <thead>
            <tr>
              <th>
                <button onClick={() => toggleSort('postId')} aria-label="Sort by Post ID">
                  Post ID <SortIcon column="postId" />
                </button>
              </th>
              <th>
                <button onClick={() => toggleSort('name')} aria-label="Sort by Name">
                  Name <SortIcon column="name" />
                </button>
              </th>
              <th>
                <button onClick={() => toggleSort('email')} aria-label="Sort by Email">
                  Email <SortIcon column="email" />
                </button>
              </th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {visibleComments.map(comment => (
              <tr key={comment.id}>
                <td><span className="badge">#{comment.postId}</span></td>
                <td>{comment.name}</td>
                <td><a href={`mailto:${comment.email}`}>{comment.email}</a></td>
                <td>{comment.body}</td>
              </tr>
            ))}
            {visibleComments.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--muted)' }}>No results</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination" role="navigation" aria-label="Pagination">
        <div className="page-buttons">
          <button className="btn" onClick={() => setCurrentPage(1)} disabled={safePage === 1}>⏮ First</button>
          <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={safePage === 1}>◀ Prev</button>
          {pageNumbers.slice(Math.max(0, safePage - 3), safePage + 2).map(num => (
            <button key={num} className="btn" onClick={() => setCurrentPage(num)} aria-current={num === safePage ? 'page' : undefined} disabled={num === safePage}>
              {num}
            </button>
          ))}
          <button className="btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>Next ▶</button>
          <button className="btn" onClick={() => setCurrentPage(totalPages)} disabled={safePage === totalPages}>Last ⏭</button>
        </div>
        <div className="badge">Page {safePage} of {totalPages}</div>
      </div>
    </section>
  )
}
