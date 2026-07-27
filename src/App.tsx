import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Roles from '@/pages/Roles'
import HowItWorks from '@/pages/HowItWorks'
import Reviews from '@/pages/Reviews'
import Contact from '@/pages/Contact'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  )
}
