const DB_NAME    = 'ShanmugaCraftAdmin'
const DB_VERSION = 1
const STORE_NAME = 'cache'
const CACHE_TTL  = 5 * 60 * 1000  // 5 minutes

/* Open IndexedDB */
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }

    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror   = (e) => reject(e.target.error)
  })
}

/* Save data to cache */
export async function setCache(key, data) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.put({ key, data, timestamp: Date.now() })
    tx.oncomplete = () => resolve()
    tx.onerror    = (e) => reject(e.target.error)
  })
}

/* Get data from cache */
export async function getCache(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.get(key)

    req.onsuccess = (e) => {
      const result = e.target.result
      if (!result) return resolve(null)

      // Check if cache is expired
      if (Date.now() - result.timestamp > CACHE_TTL) {
        return resolve(null)  // expired — fetch fresh from server
      }

      resolve(result.data)
    }

    req.onerror = (e) => reject(e.target.error)
  })
}

/* Clear cache (force refresh from server) */
export async function clearCache(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    store.delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror    = (e) => reject(e.target.error)
  })
}
