import { BrowserRouter, Route, Routes } from 'react-router-dom'

import About from './pages/About'
import Home from './pages/Home'
import NoMatch from './pages/NoMatch'

import 'tailwindcss/tailwind.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='about' element={<About />} />
        <Route path='*' element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
