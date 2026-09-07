import axios from 'axios'

/**
 * The one configured HTTP client for the app. No real backend exists yet for
 * this prototype — every module's `services/endpoints/*` calls resolve from
 * local mock data today, but they're shaped so swapping a mock function's
 * body for `httpClient.get(...)` is the only change needed once a real API
 * exists.
 */
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
