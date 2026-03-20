import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, isSessionValid } from '../utils/auth.js'
import { getAllInquiries, markAsDone, deleteInquiry } from '../api/contact.js'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [inquiries, setInquiries]     = useState([])
  const [filtered,  setFiltered]      = useState([])
  const [loading,   setLoading]       = useState(true)
  const [error,     setError]         = useState('')
  const [search,    setSearch]        = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter,   setTypeFilter]   = useState('all')
  const [selected,  setSelected]      = useState(null)
  const [fromCache, setFromCache]     = useState(false)

  useEffect(() => {
    if (!isSessionValid()) navigate('/')
  }, [])

  const loadData = useCallback(async (force = false) => {
    try {
      setLoading(true)
      setError('')
      const data = await getAllInquiries(force)
      setInquiries(data)
      setFromCache(!force)
    } catch (err) {
      setError('Could not load inquiries. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  useEffect(() => {
    let result = [...inquiries]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(r =>
        r.name?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q)
      )
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter)
    if (typeFilter   !== 'all') result = result.filter(r => r.inquiry_type === typeFilter)
    setFiltered(result)
  }, [inquiries, search, statusFilter, typeFilter])

  const total    = inquiries.length
  const newCount = inquiries.filter(r => r.status === 'new').length
  const done     = inquiries.filter(r => r.status === 'done').length
  const types    = ['all', ...new Set(inquiries.map(r => r.inquiry_type).filter(Boolean))]

  const handleDone = async (id, e) => {
    e.stopPropagation()
    await markAsDone(id)
    await loadData(true)
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this inquiry?')) return
    await deleteInquiry(id)
    await loadData(true)
    if (selected?.id === id) setSelected(null)
  }

  const handleLogout = () => { logout(); navigate('/') }

  const fmtDate = (dt) =>
    new Date(dt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  return (
    <div className="dash-root">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-icon"><i className="fa-solid fa-coins"></i></div>
          <div>
            <p className="sidebar-brand">Shanmuga Craft</p>
            <p className="sidebar-role">Admin Panel</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <i className="fa-solid fa-inbox"></i>
            <span>Inquiries</span>
            {newCount > 0 && <span className="nav-badge">{newCount}</span>}
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar"><i className="fa-solid fa-user-tie"></i></div>
            <div>
              <p className="user-name">Admin</p>
              <p className="user-role">Shanmuga Craft</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">

        <div className="topbar">
          <div>
            <h1 className="page-title">Customer Inquiries</h1>
            <p className="page-sub">Manage and respond to all customer inquiries</p>
          </div>
          <button className="refresh-btn" onClick={() => loadData(true)}>
            <i className="fa-solid fa-rotate-right"></i> Refresh
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-icon stat-icon--total">
              <i className="fa-solid fa-envelope-open-text"></i>
            </div>
            <div>
              <p className="stat-label">Total Inquiries</p>
              <p className="stat-value">{total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--new">
              <i className="fa-solid fa-bell"></i>
            </div>
            <div>
              <p className="stat-label">New</p>
              <p className="stat-value">{newCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--done">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div>
              <p className="stat-label">Completed</p>
              <p className="stat-value">{done}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon--cache">
              <i className="fa-solid fa-database"></i>
            </div>
            <div>
              <p className="stat-label">Data Source</p>
              <p className="stat-value stat-value--sm">
                {fromCache
  ? <><i className="fa-solid fa-bolt"></i> Cache</>
  : <><i className="fa-solid fa-globe"></i> Live</>
}
              </p>
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="filters-bar">
          <div className="search-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch('')}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="done">Done</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            {types.map(t => (
              <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="dash-error">
            <i className="fa-solid fa-triangle-exclamation"></i> {error}
          </div>
        )}

        {/* ── Table ── */}
        {loading ? (
          <div className="loading-wrap">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading inquiries…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-wrap">
            <i className="fa-solid fa-inbox"></i>
            <p>No inquiries found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="inq-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Inquiry Type</th>
                  <th>Coin Details</th>
                  <th>Budget</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr key={row.id} onClick={() => setSelected(row)} className="table-row">
                    <td className="td-num">{i + 1}</td>
                    <td>
                      <p className="td-name">{row.name}</p>
                      <p className="td-email">{row.email}</p>
                      {row.phone && <p className="td-phone"><i className="fa-solid fa-phone"></i> {row.phone}</p>}
                    </td>
                    <td><span className="inq-type">{row.inquiry_type || '—'}</span></td>
                    <td>
                      <p>{row.coin_type || '—'}</p>
                      {row.coin_weight && <p className="td-small">{row.coin_weight}</p>}
                    </td>
                    <td className="td-budget">{row.budget || '—'}</td>
                    <td className="td-date">{fmtDate(row.created_at)}</td>
                    <td>
                      <span className={`status-badge status--${row.status}`}>
                        {row.status === 'new'
                          ? <><i className="fa-solid fa-circle-dot"></i> New</>
                          : <><i className="fa-solid fa-circle-check"></i> Done</>
                        }
                      </span>
                    </td>

                    {/* ── FIX: placeholder keeps column even for DONE rows ── */}
                    <td>
                      <div className="td-actions">
                        {row.status === 'new' ? (
                          <button
                            className="act-btn act-btn--done"
                            onClick={(e) => handleDone(row.id, e)}
                            title="Mark as Done"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                        ) : (
                          <span className="act-btn--placeholder" />
                        )}
                        <button
                          className="act-btn act-btn--view"
                          onClick={(e) => { e.stopPropagation(); setSelected(row) }}
                          title="View Details"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button
                          className="act-btn act-btn--del"
                          onClick={(e) => handleDelete(row.id, e)}
                          title="Delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-name">{selected.name}</h2>
                <span className={`status-badge status--${selected.status}`}>
                  {selected.status === 'new'
                    ? <><i className="fa-solid fa-circle-dot"></i> New</>
                    : <><i className="fa-solid fa-circle-check"></i> Done</>
                  }
                </span>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="modal-grid">
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-envelope"></i> Email</p>
                <p className="mf-val">{selected.email}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-phone"></i> Phone</p>
                <p className="mf-val">{selected.phone || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-tag"></i> Inquiry Type</p>
                <p className="mf-val">{selected.inquiry_type || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-coins"></i> Coin Type</p>
                <p className="mf-val">{selected.coin_type || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-weight-scale"></i> Weight</p>
                <p className="mf-val">{selected.coin_weight || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-indian-rupee-sign"></i> Budget</p>
                <p className="mf-val">{selected.budget || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-clock"></i> Preferred Time</p>
                <p className="mf-val">{selected.contact_time || '—'}</p>
              </div>
              <div className="modal-field">
                <p className="mf-label"><i className="fa-solid fa-calendar"></i> Received</p>
                <p className="mf-val">{fmtDate(selected.created_at)}</p>
              </div>
            </div>

            <div className="modal-message">
              <p className="mf-label"><i className="fa-solid fa-comment-dots"></i> Message</p>
              <p className="mf-msg">{selected.message}</p>
            </div>

            <div className="modal-actions">
              {selected.status === 'new' && (
                <button className="modal-btn modal-btn--done"
                  onClick={(e) => { handleDone(selected.id, e); setSelected(null) }}>
                  <i className="fa-solid fa-check"></i> Mark as Done
                </button>
              )}
              <button className="modal-btn modal-btn--del"
                onClick={(e) => handleDelete(selected.id, e)}>
                <i className="fa-solid fa-trash"></i> Delete
              </button>
              <button className="modal-btn modal-btn--close"
                onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard