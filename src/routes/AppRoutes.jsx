import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from "../page/member/Loginpage"
import Homepage from "../page/member/Homepage"
import ProtectedRoute from './ProtectedRoute'
import LoginAdminpage from '../page/admin/LoginAdminpage'
import LoginLibrarianpage from '../page/Librarian/LoginLibrarianpage'
import RoleProtectedRoute from './RoleProtectedRoute'
import DashboardAdmin from '../page/admin/DashboardAdmin'
import DashboardLibrarian from '../page/Librarian/DashboardLibrarian'
import AdminLayout from '../layouts/AdminLayout'
import Book from '../page/admin/Book'
import Category from '../page/admin/category'
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/admin/login' element={<LoginAdminpage/>} />
        <Route path='/librarian/login' element={<LoginLibrarianpage/>} />
        {/* route Member */}
        <Route
          path="/"
          element={
            <RoleProtectedRoute role="Member">
              <Homepage/>
            </RoleProtectedRoute>
          }
        />
        {/* route Admin */}
        <Route 
          path='/admin'
          element={
          <RoleProtectedRoute role="Admin">
            <AdminLayout/>
          </RoleProtectedRoute>
        }
        >
          <Route path='/admin' element={<DashboardAdmin/>} />
          <Route path='/admin/books' element={<Book/>} />
          <Route path='/admin/category' element={<Category/>} />
        </Route>
        {/* route librarian */}
        <Route
        path='/librarian/dashboard'
        element={
          <RoleProtectedRoute role="Librarian">
            <DashboardLibrarian/>
          </RoleProtectedRoute>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
