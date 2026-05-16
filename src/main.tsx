import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const params = new URLSearchParams(window.location.search)
const impersonationToken = params.get('impersonation-token')
if (impersonationToken) {
  sessionStorage.setItem('impersonation-token', impersonationToken)
  params.delete('impersonation-token')
  const newSearch = params.toString()
  history.replaceState(null, '', `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`)
}

createRoot(document.getElementById("root")!).render(<App />);
