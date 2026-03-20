import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, setupAdminCredentials } from '../utils/auth.js'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()

  const cardRef   = useRef(null)
  const btnRef    = useRef(null)
  const rippleRef = useRef(null)

  useEffect(() => {
    setupAdminCredentials()
    if (localStorage.getItem('admin_logged_in') === 'true') {
      navigate('/dashboard')
    }
  }, [])

  /* ── 3-D Card Tilt on Mouse Move ── */
  const handleCardMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5   // -0.5 → 0.5
    const y = (e.clientY - top)  / height - 0.5
    card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(4px)`
  }, [])

  const handleCardLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }, [])

  /* ── Liquid Ripple on Button Click ── */
  const handleBtnClick = useCallback((e) => {
    const btn  = btnRef.current
    if (!btn) return
    const old = btn.querySelector('.btn-ripple')
    if (old) old.remove()

    const { left, top } = btn.getBoundingClientRect()
    const ripple = document.createElement('span')
    ripple.className = 'btn-ripple'
    ripple.style.left = (e.clientX - left) + 'px'
    ripple.style.top  = (e.clientY - top)  + 'px'
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(username, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="login-bg">

      {/* Floating ambient orbs */}
      <span className="orb orb-1" />
      <span className="orb orb-2" />
      <span className="orb orb-3" />
      <span className="orb orb-4" />

      <div
        className="login-card"
        ref={cardRef}
        onMouseMove={handleCardMove}
        onMouseLeave={handleCardLeave}
      >
        {/* Inner glare layer that shifts with tilt */}
        <div className="card-glare" />

        <div className="login-logo">
          <i className="fa-solid fa-coins" />
          {/* Pulse rings */}
          <span className="pulse-ring r1" />
          <span className="pulse-ring r2" />
        </div>

        <h1 className="login-title">Shanmuga Craft</h1>
        <p className="login-subtitle">Admin Portal</p>
        <div className="login-divider" />

        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label><i className="fa-solid fa-user" /> Username</label>
            <div className="input-wrap">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
              {/* Scan line on focus */}
              <span className="input-scan" />
            </div>
          </div>

          <div className="form-group">
            <label><i className="fa-solid fa-lock" /> Password</label>
            <div className="input-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-scan" />
              <button
                type="button"
                className="show-pass"
                onClick={() => setShowPass(!showPass)}
              >
                <i className={`fa-solid ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <i className="fa-solid fa-circle-exclamation" /> {error}
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
            ref={btnRef}
            onMouseDown={handleBtnClick}
          >
            {/* Liquid fill layer */}
            <span className="btn-liquid" />
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-right-to-bracket'}`} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <p className="login-footer">
          <i className="fa-solid fa-shield-halved" /> Secure Admin Access
        </p>
      </div>
    </div>
  )
}

export default Login