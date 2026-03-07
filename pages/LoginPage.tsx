import React, { useState } from "react"
import { HeartPulse, Mail, Lock } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login, user } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await login(email, password)
            navigate("/")
            console.log("Logged In")
        } catch (error: any) {
            console.error(error)
            // Gently alert the user without exposing specific internal details
            alert("Login failed. Please check your credentials.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-slate-100 px-6 min-h-[80vh]">
            <div className="grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full">
                <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <HeartPulse size={40} />
                            <h1 className="text-3xl font-black tracking-tight">
                                MedQR
                            </h1>
                        </div>
                        <p className="text-blue-100 leading-relaxed text-lg">
                            Your digital medical identity for emergencies.
                            Instantly share life-saving information with first
                            responders.
                        </p>
                    </div>
                    <HeartPulse className="absolute -right-20 -bottom-20 text-blue-500/20 w-80 h-80" />
                </div>

                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-500 mb-8 text-sm">
                        Login to manage your health vault
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">
                                Email
                            </label>
                            <div className="flex items-center border border-slate-200 rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <Mail className="text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="w-full p-3 outline-none text-slate-700 bg-transparent"
                                    placeholder="name@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">
                                Password
                            </label>
                            <div className="flex items-center border border-slate-200 rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <Lock className="text-slate-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full p-3 outline-none text-slate-700 bg-transparent"
                                    placeholder="••••••••"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
                            }`}
                        >
                            {loading ? "Verifying..." : "Login to Dashboard"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 text-center mt-8">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Create one free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
