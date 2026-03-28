const VITE_API_URL = import.meta.env.VITE_API_URL;

// On Railway or production, VITE_API_URL might not be bundled if not present during build.
// This ensures we have a valid Absolute URL or a relative fallback.
export const API_BASE_URL = VITE_API_URL && VITE_API_URL !== 'undefined'
  ? VITE_API_URL
  : (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

console.log('Using API Base URL:', API_BASE_URL);
