import React from 'react'
import { getRole, getToken } from '../utils/auth'
import { Navigate } from 'react-router-dom'

function RoleProtectedRoute({children , role}) {
  const token = getToken()
  const userRole = getRole()
  if(!token){
    return <Navigate to='/login' replace />
  }
  if(role && userRole !== role){
    if (userRole === "Admin") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "Librarian") {
      return <Navigate to="/librarian/dashboard" replace />;
    }
    return <Navigate to='/' replace />
  }
  return children
}

export default RoleProtectedRoute
