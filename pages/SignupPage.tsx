import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { HeartPulse, Mail, Lock, User } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const SignupPage: React.FC = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { updateProfile } = useAuth() // Hook to initialize the profile

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 6) {
            return alert("Password should be at least 6 characters.")
        }

        try {
            setLoading(true)

            // 1. Create the Auth User
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const user = userCredential.user

            // 2. Initialize the Medical Profile in Firestore
            // This prevents the "Profile not found" error on the first login
            await updateProfile(
                {
                    id: user.uid,
                    fullName: name,
                    dateOfBirth: "",
                    bloodType: "" as any,
                    allergies: [],
                    medications: [],
                    conditions: [],
                    organDonor: false,
                    insuranceProvider: "",
                    insurancePolicyNumber: "",
                    emergencyContacts: [],
                    additionalNotes: "",
                },
                user.uid,
            )

            navigate("/edit") // Redirect to dashboard
        } catch (error: any) {
            console.error(error)
            alert(error.message || "Signup failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-100 px-6 py-12">
            <div className="grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full">
                {/* Left Info Panel */}
                <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <HeartPulse size={40} />
                            <h1 className="text-3xl font-black tracking-tight">
                                MedQR
                            </h1>
                        </div>
                        <p className="text-blue-100 leading-relaxed text-lg">
                            Join thousands of users who trust MedQR to keep
                            their medical information accessible when every
                            second counts.
                        </p>
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-blue-100">
                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">
                                    ✔
                                </div>
                                Secure encryption for your data
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-100">
                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">
                                    ✔
                                </div>
                                One-tap QR code generation
                            </div>
                        </div>
                    </div>
                    <HeartPulse className="absolute -right-20 -bottom-20 text-blue-500/20 w-80 h-80" />
                </div>

                {/* Signup Form */}
                <div className="p-10 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Create Account
                    </h2>
                    <p className="text-slate-500 mb-8 text-sm">
                        Sign up to get started
                    </p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">
                                Full Name
                            </label>
                            <div className="flex items-center border border-slate-200 rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <User className="text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full p-3 outline-none bg-transparent"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-600 ml-1">
                                Email
                            </label>
                            <div className="flex items-center border border-slate-200 rounded-xl px-3 mt-1 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <Mail className="text-slate-400" size={18} />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full p-3 outline-none bg-transparent"
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
                                    placeholder="Min. 6 characters"
                                    className="w-full p-3 outline-none bg-transparent"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 mt-4 transition-all ${
                                loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
                            }`}
                        >
                            {loading
                                ? "Creating your Vault..."
                                : "Create My Profile"}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 text-center mt-8">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-bold hover:underline"
                        >
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupPage
