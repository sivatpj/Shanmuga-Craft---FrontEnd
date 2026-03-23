import { useEffect, useState } from 'react'
import { useSSEContext } from '../context/SSEContext'
import CitySelector from './CitySelector'
import '../styles/SilverPrice.css'
import { fetchPrices } from '../services/api'

const PURITIES = ['999', '925', '900']

// ── 0 = dev (full details)  |  1 = production (time only) ──
const DISPLAY_MODE = 1

function usePrevious(value) {
  const [prev, setPrev] = useState()
  useEffect(() => { setPrev(value) }, [value])
  return prev
}

function Ticker({ value }) {
  const prev    = usePrevious(value)
  const changed = prev !== undefined && prev !== value
  const up      = changed && value > prev
  return (
    <span className={`gp-ticker ${changed ? (up ? 'gp-tick-up' : 'gp-tick-down') : ''}`}>
      {value != null ? `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
    </span>
  )
}

function toDate(ts) {
  if (!ts) return null
  const normalized = typeof ts === 'string' ? ts.replace(' ', 'T') : ts
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

function fmtTimeDev(ts) {
  const date = toDate(ts)
  if (!date) return '—'
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function fmtTimeProd(ts) {
  const date = toDate(ts)
  if (!date) return '—'
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const fmtTime = (ts) => DISPLAY_MODE === 0 ? fmtTimeDev(ts) : fmtTimeProd(ts)

function isMarketHoursNow(now) {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
  const ist = new Date(now.getTime() + IST_OFFSET_MS)
  const dow = ist.getUTCDay() // 0=Sun, 6=Sat
  if (dow === 0 || dow === 6) return false
  const hhmm = ist.toISOString().slice(11, 19)
  return hhmm >= '09:30:00' && hhmm < '18:30:00'
}

function fmtAgo(ts, now = new Date()) {
  const date = toDate(ts)
  if (!date) return null
  const diffMs  = now.getTime() - date.getTime()
  if (!Number.isFinite(diffMs) || diffMs < 0) return null
  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 5)  return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr  = Math.floor(diffMin / 60)
  return `${diffHr}h ${diffMin % 60}m ago`
}

function parsePricePayload(data, type) {
  const result = {}
  data.filter(d => d.type === type).forEach(d => {
    if (!result[d.city_name]) result[d.city_name] = {}
    result[d.city_name][d.purity] = {
      rate_per_gram:     parseFloat(d.rate_per_gram),
      market_timestamp:  d.market_timestamp  ?? null,
      fetched_timestamp: d.fetched_timestamp ?? null,
    }
  })
  return result
}

function getLatestTs(prices, key) {
  let latest = null
  Object.values(prices).forEach(cityPurities => {
    Object.values(cityPurities).forEach(p => {
      const ts = p?.[key]
      if (ts && (!latest || new Date(ts) > new Date(latest))) latest = ts
    })
  })
  return latest
}

export default function SilverPriceTable() {
  const [prices, setPrices]               = useState({})
  const [prevPrices, setPrevPrices]       = useState({})
  const [selectedPurity, setSelectedPurity] = useState('999')
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [selectedCities, setSelectedCities] = useState([])
  const [now, setNow]                     = useState(() => new Date())

  const { connected, priceData } = useSSEContext()

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchPrices()
        setPrices(parsePricePayload(data, 'Silver'))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!priceData) return
    const incoming = Array.isArray(priceData) ? priceData : priceData?.data
    if (!incoming) return
    setPrices(prev => {
      const snapshot  = { ...prev }
      const newParsed = parsePricePayload(incoming, 'Silver')
      setPrevPrices(snapshot)
      Object.keys(newParsed).forEach(city => {
        snapshot[city] = { ...(snapshot[city] || {}), ...newParsed[city] }
      })
      return snapshot
    })
  }, [priceData])

  const getRate     = (city, p) => prices?.[city]?.[p]?.rate_per_gram    ?? null
  const getPrevRate = (city, p) => prevPrices?.[city]?.[p]?.rate_per_gram ?? null
  const getMarketTs = (city, p) => prices?.[city]?.[p]?.market_timestamp  ?? null

  const showMarketTime = isMarketHoursNow(now)

  const getTrend = (city, p) => {
    const curr = getRate(city, p), prev = getPrevRate(city, p)
    if (!curr || !prev || curr === prev) return 'neutral'
    return curr > prev ? 'up' : 'down'
  }

  const getDiff = (city, p) => {
    const curr = getRate(city, p), prev = getPrevRate(city, p)
    if (!curr || !prev || curr === prev) return null
    const diff = curr - prev
    return diff > 0 ? `+₹${diff.toFixed(2)}` : `-₹${Math.abs(diff).toFixed(2)}`
  }

  if (loading) return (
    <div className="silver-price-section">
      <div className="silver-price-container">
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#926f0e', fontWeight: 700, fontSize: '1.1rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }} />Loading silver prices…
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="silver-price-section">
      <div className="silver-price-container">
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#b45309', fontWeight: 700 }}>⚠ {error}</div>
      </div>
    </div>
  )

  const allCities     = Object.keys(prices)
  const displayCities = allCities.filter(city => selectedCities.length === 0 || selectedCities.includes(city))

  const latestMarketTs  = getLatestTs(prices, 'market_timestamp')
  const latestFetchedTs = getLatestTs(prices, 'fetched_timestamp')

  const updatedAgo   = DISPLAY_MODE === 0 ? fmtAgo(latestFetchedTs, now) : null
  const marketLagMin = DISPLAY_MODE === 0 ? (() => {
    const market  = toDate(latestMarketTs)
    const fetched = toDate(latestFetchedTs)
    if (!market || !fetched) return null
    const lagMs = fetched.getTime() - market.getTime()
    return Number.isFinite(lagMs) && lagMs > 0 ? Math.floor(lagMs / 60000) : null
  })() : null

  return (
    <div className="silver-price-section">
      <div className="silver-price-container">

        <div className="silver-price-header">
          <div className="price-header-content">
            <h2 className="silver-price-title">Today's Silver Price</h2>
            <p className="silver-price-subtitle">Live silver rates in Tamil Nadu (per gram)</p>
          </div>

          <div className="silver-price-meta">
            <div className="silver-price-update">
              <span className="silver-update-icon"><i className="fas fa-clock" /></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: connected ? '#22c55e' : '#ef4444',
                  display: 'inline-block',
                  boxShadow: connected ? '0 0 6px #22c55e' : 'none',
                }} />

                {DISPLAY_MODE === 0 ? (
                  /* ── DEV: full details ── */
                  <span>
                    Updated: {fmtTimeDev(latestFetchedTs)}
                    {updatedAgo ? ` (${updatedAgo})` : ''}
                    {latestMarketTs && (
                      <span style={{ opacity: 0.8 }}>
                        {' '}| Market: {fmtTimeDev(latestMarketTs)}
                        {marketLagMin != null ? ` (${marketLagMin}m behind)` : ''}
                      </span>
                    )}
                  </span>
                ) : (
                  /* ── PROD: time only ── */
                  <span>Updated: {fmtTimeProd(latestFetchedTs)}</span>
                )}
              </span>
            </div>

            <CitySelector type="Silver" selectedCities={selectedCities} onSelectionChange={setSelectedCities} />
          </div>
        </div>

        <div className="silver-purity-toggle">
          {PURITIES.map(p => (
            <button key={p}
              className={`silver-purity-btn ${selectedPurity === p ? 'silver-purity-btn--active' : 'silver-purity-btn--inactive'}`}
              onClick={() => setSelectedPurity(p)}>
              {p}
            </button>
          ))}
        </div>

        <div className="silver-rates" style={{ gridTemplateColumns: `repeat(${Math.min(displayCities.length, 3)}, 1fr)` }}>
          {displayCities.map(city => {
            const rate     = getRate(city, selectedPurity)
            const trend    = getTrend(city, selectedPurity)
            const diff     = getDiff(city, selectedPurity)
            const marketTs = getMarketTs(city, selectedPurity)
            return (
              <div key={city} className="silver-rate-card">
                <div className="silver-rate-card-header">
                  <span className="silver-rate-purity">{city}</span>
                  <span className="silver-rate-badge">{selectedPurity} · Per Gram</span>
                </div>
                <div className="silver-rate-price"><Ticker value={rate} /></div>
                <div className="silver-rate-trend">
                  {trend === 'up'      && <span className="silver-trend-badge silver-trend-up">▲</span>}
                  {trend === 'down'    && <span className="silver-trend-badge silver-trend-down">▼</span>}
                  {trend === 'neutral' && <span className="silver-trend-badge silver-trend-neutral">—</span>}
                  <span className="silver-trend-text" style={{ color: trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : undefined }}>
                    {diff ?? 'No change'}
                  </span>
                </div>
                {showMarketTime && marketTs && (
                  <div className="rate-market-ts">
                    <i className="fas fa-signal" style={{ fontSize: '0.7rem', marginRight: 5, opacity: 0.7 }} />
                    <span className="market-ts-label">Market</span>
                    <span className="market-ts-value">{fmtTime(marketTs)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {displayCities.map(city => (
          <div key={city} className="silver-table-wrapper">
            <h3 className="silver-table-title">{city} — Silver Price</h3>
            <div className="silver-table-responsive">
              <table className="silver-price-table">
                <thead>
                  <tr>
                    <th className="silver-table-header">Purity</th>
                    <th className="silver-table-header">Per Gram</th>
                    {showMarketTime && <th className="silver-table-header">Market Time</th>}
                  </tr>
                </thead>
                <tbody>
                  {PURITIES.map(p => {
                    const rate     = getRate(city, p)
                    const marketTs = getMarketTs(city, p)
                    return (
                      <tr key={p} className="silver-table-row"
                        style={p === selectedPurity ? { outline: '2px solid #c9a84c', outlineOffset: -2 } : {}}>
                        <td className="silver-table-cell">
                          <span className="silver-weight-value">{p}</span>
                          <span className="silver-weight-unit"> Silver</span>
                        </td>
                        <td className="silver-table-cell silver-cell-price"
                          style={{ fontWeight: p === selectedPurity ? 800 : 400, opacity: p === selectedPurity ? 1 : 0.7 }}>
                          <Ticker value={rate} />
                        </td>
                        {showMarketTime && (
                          <td className="silver-table-cell" style={{ fontSize: '0.82rem', opacity: 0.85 }}>
                            {fmtTime(marketTs)}
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <div className="silver-info-cards">
          {[
            { icon: 'fa-shield-halved', title: 'Hallmarked Quality', text: 'All silver products are BIS hallmarked for certified purity' },
            { icon: 'fa-chart-line',    title: 'Live Updates',       text: 'Prices stream in real-time via SSE every 5 minutes' },
            { icon: 'fa-rotate',        title: 'Buyback Guarantee',  text: 'Lifetime buyback at current market rates for all hallmarked products' },
          ].map(card => (
            <div key={card.title} className="silver-info-card">
              <div className="silver-info-icon"><i className={`fas ${card.icon}`} /></div>
              <h4 className="silver-info-title">{card.title}</h4>
              <p className="silver-info-text">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="silver-disclaimer">
          <p><strong>Note:</strong> Prices are indicative and subject to change. GST charges apply as per government regulations. Final prices confirmed at the time of purchase.</p>
        </div>

      </div>
    </div>
  )
}
