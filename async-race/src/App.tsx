import { Route, Routes } from 'react-router-dom'
import GaragePage from './pages/GaragePage'
import WinnerPage from './pages/WinnerPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<GaragePage />} />
      <Route path='/winner' element={<WinnerPage />} />
    </Routes>
  )
}

export default App
