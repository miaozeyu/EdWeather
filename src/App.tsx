import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import ForecastPage from './pages/ForecastPage'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/forecast/:lat/:lon/:city" element={<ForecastPage />} />
      </Routes>
    </div>
  )
}

export default App
