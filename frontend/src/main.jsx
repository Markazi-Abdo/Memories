import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from "react-router-dom"
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 10
    }
  }
});

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <Router>
      <App />
    </Router>
  </QueryClientProvider>
)
