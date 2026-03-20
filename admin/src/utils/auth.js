import bcrypt from 'bcryptjs'

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'Shanmugacraft@12345'

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}


export async function setupAdminCredentials() {
  const stored = localStorage.getItem('admin_hash')
  if (!stored) {
    const hash = await hashPassword(ADMIN_PASSWORD)
    localStorage.setItem('admin_hash', hash)
    localStorage.setItem('admin_user', ADMIN_USERNAME)
  }
}

export async function login(username, password) {
  const storedUser = localStorage.getItem('admin_user')
  const storedHash = localStorage.getItem('admin_hash')

  if (!storedHash) {
    await setupAdminCredentials()
    return login(username, password)
  }

  const isMatch = await bcrypt.compare(password, storedHash)

  if (username === storedUser && isMatch) {
    localStorage.setItem('admin_logged_in', 'true')
    localStorage.setItem('admin_login_time', Date.now().toString())
    return { success: true }
  }

  return { success: false, error: 'Invalid username or password' }
}

export function logout() {
  localStorage.removeItem('admin_logged_in')
  localStorage.removeItem('admin_login_time')
}


export function isSessionValid() {
  const loggedIn  = localStorage.getItem('admin_logged_in') === 'true'
  const loginTime = parseInt(localStorage.getItem('admin_login_time') || '0')
  const eightHours = 8 * 60 * 60 * 1000

  if (!loggedIn) return false
  if (Date.now() - loginTime > eightHours) {
    logout()
    return false
  }
  return true
}

export async function changePassword(newPassword) {
  const hash = await hashPassword(newPassword)
  localStorage.setItem('admin_hash', hash)
}