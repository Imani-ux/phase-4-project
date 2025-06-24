import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import SelectRole from './pages/SelectRole'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import EmployerDashboard from './pages/dashboard/EmployerDashboard'
import SeekerDashboard from './pages/dashboard/SeekerDashboard'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
      </Routes>
    </>
  )
}

export default App
