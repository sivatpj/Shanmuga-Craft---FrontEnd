import { useEffect, useRef, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL
const ENV_SSE_URL = import.meta.env.VITE_SSE_URL
const SSE_DEBUG = String(import.meta.env.VITE_SSE_DEBUG || '').toLowerCase() === 'true'

function buildSseUrl() {
  if (ENV_SSE_URL) return ENV_SSE_URL

  // In dev we have a Vite proxy for `/api` → `VITE_API_URL`, so prefer same-origin.
  if (import.meta.env.DEV) return '/api/v1/prices/stream'

  // In prod, fall back to absolute URL if provided, otherwise same-origin.
  if (!API_URL) return '/api/v1/prices/stream'
  return `${String(API_URL).replace(/\/$/, '')}/api/v1/prices/stream`
}

function normalizePayload(payload) {
  if (Array.isArray(payload)) return payload
  if (payload?.data && Array.isArray(payload.data)) return payload.data

  // Legacy shape support (if server sends grouped cities).
  if (payload?.cities && Array.isArray(payload.cities)) {
    const flat = []
    payload.cities.forEach(cityObj => {
      const city_name = cityObj.city_name

      if (Array.isArray(cityObj.gold)) {
        cityObj.gold.forEach(g => {
          flat.push({
            city_name,
            type: 'Gold',
            purity: g.purity,
            rate_per_gram: g.rate_per_gram,
            rate_per_sovereign: g.rate_per_sovereign ?? null,
            market_timestamp: g.market_timestamp ?? payload.fetched_at,
            fetched_timestamp: payload.fetched_at,
          })
        })
      }

      if (Array.isArray(cityObj.silver)) {
        cityObj.silver.forEach(s => {
          flat.push({
            city_name,
            type: 'Silver',
            purity: s.purity,
            rate_per_gram: s.rate_per_gram,
            market_timestamp: s.market_timestamp ?? payload.fetched_at,
            fetched_timestamp: payload.fetched_at,
          })
        })
      }
    })
    return flat
  }

  if (import.meta.env.DEV && SSE_DEBUG) console.warn('[SSE] unknown payload shape:', payload)
  return null
}

export function useSSE() {
  const esRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [priceData, setPriceData] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = buildSseUrl()
    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => {
      setConnected(true)
      setError(null)
      if (import.meta.env.DEV && SSE_DEBUG) console.log('[SSE] connected', { url })
    }

    es.addEventListener('price_update', (e) => {
      try {
        const parsed = JSON.parse(e.data)
        const normalized = normalizePayload(parsed)
        if (normalized) {
          setPriceData(normalized)
          setLastUpdate(new Date())
        }
      } catch (err) {
        if (import.meta.env.DEV && SSE_DEBUG) console.error('[SSE] Failed to parse price_update:', err, e?.data)
      }
    })

    es.onerror = () => {
      // EventSource closes the connection before auto-reconnecting.
      setConnected(false)
      setError('SSE connection lost')
      if (import.meta.env.DEV && SSE_DEBUG) console.warn('[SSE] connection lost — browser will retry automatically')
    }

    return () => {
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
      }
    }
  }, [])

  return { connected, priceData, lastUpdate, error }
}
