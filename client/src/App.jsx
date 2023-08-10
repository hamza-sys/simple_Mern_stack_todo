
import './App.css'
import Register from './pages/Register'
import Login from './pages/Login'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFound from './pages/NotFound'
import TodosForm from './pages/TodosForm'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TodosForm />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
