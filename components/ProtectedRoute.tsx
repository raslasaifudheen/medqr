import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import React from "react"

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth()

    if (loading) return null

    // ONLY redirect to login if the Firebase Account doesn't exist
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
