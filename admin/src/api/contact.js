import { getCache, setCache, clearCache } from '../utils/cache.js'

const API_URL = 'http://localhost:5000/api/contact'

export async function getAllInquiries(forceRefresh = false) {
  const CACHE_KEY = 'all_inquiries'

  if (!forceRefresh) {
    const cached = await getCache(CACHE_KEY)
    if (cached) return cached   // served from cache
  }

  // Cache miss or force refresh — hit the server
  const res  = await fetch(API_URL)
  const data = await res.json()

  await setCache(CACHE_KEY, data)   // save to cache
  return data
}

export async function markAsDone(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status: 'done' }),
  })

  await clearCache('all_inquiries')   // clear cache so dashboard refreshes
  return res.json()
}

export async function deleteInquiry(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  await clearCache('all_inquiries')
  return res.json()
}
