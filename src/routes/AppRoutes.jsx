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
import User from '../page/admin/Users'
import Authors from '../page/admin/Authors'
import Publishers from '../page/admin/Publishers'
import CreateBook from '../page/admin/CreateBook'
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
          <Route path='/admin/books/create' element={<CreateBook/>} />
          <Route path='/admin/category' element={<Category/>} />
          <Route path='/admin/users' element={<User/>} />
          <Route path='/admin/authors' element={<Authors/>} />
          <Route path='/admin/publishers' element={<Publishers/>} />
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
