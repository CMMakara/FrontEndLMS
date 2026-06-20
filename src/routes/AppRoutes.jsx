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
import UpdateBook from '../page/admin/UpdateBook'
import ProfileAdmin from '../page/admin/ProfileAdmin'
import LibrarianLayout from '../layouts/LibrarianLayout'
import Member from '../page/Librarian/Member'
import IssueBooks from '../page/Librarian/IssueBook'
import ReturnBooks from '../page/Librarian/ReturnBook'
import CalculateFine from '../page/Librarian/CalculateFine'
import RegisterMember from '../page/Librarian/RegisterMember'
import BorrowRecords from '../page/Librarian/BorrowRecords'
import BorrowRequests from '../page/Librarian/BorrowRequests'

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
          <Route path='/admin/books/update/:id' element={<UpdateBook/>} />
          <Route path='/admin/category' element={<Category/>} />
          <Route path='/admin/users' element={<User/>} />
          <Route path='/admin/authors' element={<Authors/>} />
          <Route path='/admin/publishers' element={<Publishers/>} />
          <Route path='/admin/profile' element={<ProfileAdmin/>} />
        </Route>
        {/* route librarian */}
        <Route
        path='/librarian'
        element={
          <RoleProtectedRoute role="Librarian">
            <LibrarianLayout/>
          </RoleProtectedRoute>
        }
        >
          <Route path='/librarian' element={<DashboardLibrarian/>} />
          <Route path='/librarian/Member' element={<Member/>} />
          <Route path='/librarian/issueBooks' element={<IssueBooks/>} />
          <Route path='/librarian/returnBooks' element={<ReturnBooks/>} />
          <Route path='/librarian/calculateFine' element={<CalculateFine/>} />
          <Route path='/librarian/borrow-requests' element={<BorrowRequests/>} />
          <Route path='/librarian/register-member' element={<RegisterMember/>} />
          <Route path='/librarian/borrow-records' element={<BorrowRecords/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
