
import { apiFetch } from './api'

export function loginUser(credentials) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function registerUser(userData) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}
