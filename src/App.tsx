import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import AdminLayout from '@/components/AdminLayout'
import Home from '@/pages/Home'
import Pricing from '@/pages/Pricing'
import Sectors from '@/pages/Sectors'
import SectorDetail from '@/pages/SectorDetail'
import RolesHub from '@/pages/RolesHub'
import RoleDetail from '@/pages/RoleDetail'
import HowItWorks from '@/pages/HowItWorks'
import Reviews from '@/pages/Reviews'
import Contact from '@/pages/Contact'
import ClientPortal from '@/pages/ClientPortal'
import DynamicPage from '@/pages/DynamicPage'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Dashboard from '@/pages/admin/Dashboard'
import Enquiries from '@/pages/admin/Enquiries'
import AdminReviews from '@/pages/admin/Reviews'
import ReviewEditor from '@/pages/admin/ReviewEditor'
import AdminPages from '@/pages/admin/Pages'
import PageEditor from '@/pages/admin/PageEditor'
import Analytics from '@/pages/admin/Analytics'

export default function App() {
  return (
    <Routes>
      {/* Public marketing site */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pricing/:region" element={<Pricing />} />
        <Route path="/sectors" element={<Sectors />} />
        <Route path="/sectors/:slug" element={<SectorDetail />} />
        <Route path="/roles" element={<RolesHub />} />
        <Route path="/roles/:slug" element={<RoleDetail />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/client-portal" element={<ClientPortal />} />
        <Route path="/p/:slug" element={<DynamicPage />} />
      </Route>

      {/* Staff admin (protected by sign-in) */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/enquiries" element={<Enquiries />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/reviews/:id" element={<ReviewEditor />} />
        <Route path="/admin/pages" element={<AdminPages />} />
        <Route path="/admin/pages/:id" element={<PageEditor />} />
        <Route path="/admin/analytics" element={<Analytics />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
