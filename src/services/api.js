const API_URL = import.meta.env.VITE_API_URL
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY

export async function fetchPrices() {

  const res = await fetch(`${API_URL}/api/v1/prices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error('Failed to fetch prices')
  }

  return json.data
}
export async function fetchZones() {

  const res = await fetch(`${API_URL}/api/v1/zones/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY
    },
    body: JSON.stringify({})
  })

  const json = await res.json()

  if (!json.success) {
    throw new Error('Failed to fetch zones')
  }

  return json.data
}