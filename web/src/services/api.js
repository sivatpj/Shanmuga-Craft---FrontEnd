const API_URL = import.meta.env.VITE_API_URL

export async function fetchPrices() {
  const res = await fetch(`${API_URL}/api/v1/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const json = await res.json()
  if (!json.success) throw new Error('Failed to fetch prices')
  return json.data
}

export async function fetchConfig() {
  const res = await fetch(`${API_URL}/api/v1/config`)
  const json = await res.json()
  if (!json.success) throw new Error('Failed to fetch config')
  return json.data
}

export async function fetchZones() {
  const res = await fetch(`${API_URL}/api/v1/zones/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const json = await res.json()
  if (!json.success) throw new Error('Failed to fetch zones')
  return json.data
}