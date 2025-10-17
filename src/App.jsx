import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { TransactionsPage } from './pages/TransactionsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SetupPage } from './pages/SetupPage'
import './App.css'

function App() {
  const [page, setPage] = useState('transactions')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      setPage(hash || 'transactions')
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'transactions':
        return <TransactionsPage />
      case 'reports':
        return <ReportsPage />
      case 'settings':
        return <SettingsPage />
      case 'setup':
        return <SetupPage />
      default:
        return <TransactionsPage />
    }
  }

  return (
    <div className="app">
      <Header />
      <main>{renderPage()}</main>
    </div>
  )
}

export default App