import React from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { HeartPulse } from "lucide-react"

// Context & Types
import { useAuth } from "./context/AuthContext"
import { MedicalProfile } from "./types"

// Components & Pages
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/NavBar"
import MedicalForm from "./components/MedicalForm"
import Dashboard from "./pages/DashBoard"
import EmergencyWrapper from "./pages/EmergencyWrapper"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"

const App: React.FC = () => {
    const { user, profile, loading, updateProfile, logout } = useAuth()
    const navigate = useNavigate()

    const handleSave = async (newProfile: MedicalProfile) => {
        try {
            await updateProfile(newProfile)
            alert("Medical profile updated successfully!")
            navigate("/")
        } catch (error) {
            alert("Failed to save profile")
        }
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <HeartPulse
                    size={48}
                    className="text-blue-600 animate-pulse mb-4"
                />
                <p className="text-slate-500 font-medium animate-pulse">
                    Securing your vault...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {user && profile && <Navbar onLogout={handleLogout} />}

            <main
                className={`flex-1 max-w-6xl mx-auto w-full px-6 pb-24 ${user ? "pt-6 md:pt-28" : "pt-10"}`}
            >
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                {profile ? (
                                    <Dashboard profile={profile} />
                                ) : (
                                    <Navigate to="/edit" replace />
                                )}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit"
                        element={
                            <ProtectedRoute>
                                {/* We pass profile or null, the form now handles the null case */}
                                <MedicalForm
                                    initialData={profile}
                                    onSave={handleSave}
                                />
                            </ProtectedRoute>
                        }
                    />

                    {/* PUBLIC: No protection needed */}
                    <Route
                        path="/emergency/:id"
                        element={<EmergencyWrapper />}
                    />

                    {/* AUTH: Simple checks only */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
