import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import LoginPage from './auth/LoginPage'
import ProtectedRoute from './auth/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import CooperativesPage from './pages/CooperativesPage'
import MediaPage from './pages/MediaPage'
import PartnersPage from './pages/PartnersPage'
import ContentPage from './pages/ContentPage'
import FooterPage from './pages/FooterPage'
import PacksPage from './pages/PacksPage'
import MessagesPage from './pages/MessagesPage'
import SettingsPage from './pages/SettingsPage'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cooperatives" element={<CooperativesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="partners" element={<PartnersPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="packs" element={<PacksPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="footer" element={<FooterPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}