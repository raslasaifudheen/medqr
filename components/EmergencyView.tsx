import React, { useState } from "react"
import { MedicalProfile } from "../types"
import {
    Phone,
    AlertTriangle,
    ShieldCheck,
    Info,
    Lock,
    Unlock,
    KeyRound,
    FileText,
    MapPin,
} from "lucide-react"

interface Props {
    profile: MedicalProfile
}

const EmergencyView: React.FC<Props> = ({ profile }) => {
    const [isLocked, setIsLocked] = useState(true)
    const [showOtpInput, setShowOtpInput] = useState(false)
    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [isLocating, setIsLocating] = useState(false)

    // --- Geolocation Logic ---
    const handleSendLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser")
            return
        }

        setIsLocating(true)

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false)
                const { latitude, longitude } = position.coords
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

                const primaryContact = profile.emergencyContacts[0]
                const contactName = primaryContact
                    ? primaryContact.name
                    : "Emergency Contacts"

                // In a real app, this triggers an SMS API
                alert(
                    `LOCATION SENT!\n\nTo: ${contactName}\nMessage: "EMERGENCY: I need help. My current location is: ${googleMapsUrl}"`,
                )
            },
            (error) => {
                setIsLocating(false)
                alert(
                    "Unable to retrieve your location. Please ensure location services are enabled.",
                )
            },
        )
    }

    // --- OTP Logic ---
    const handleRequestOtp = () => {
        const primaryContact = profile.emergencyContacts[0]
        if (!primaryContact) {
            alert("No emergency contact found to send OTP.")
            return
        }
        alert(
            `Emergency: OTP sent to ${primaryContact.name} (${primaryContact.phone})`,
        )
        setShowOtpInput(true)
        setError("")
    }

    const handleVerifyOtp = () => {
        if (otp === "1234") {
            setIsLocked(false)
            setShowOtpInput(false)
        } else {
            setError("Invalid OTP. Please try again.")
        }
    }

    const renderContent = (data: string | string[]) => {
        if (Array.isArray(data)) {
            return data.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg text-sm"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            {item}
                        </li>
                    ))}
                </ul>
            ) : null
        }
        return data ? (
            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                {data}
            </p>
        ) : null
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Banner */}
            <div className="bg-red-600 text-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <AlertTriangle size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight">
                        Emergency Profile
                    </h1>
                    <p className="opacity-90 font-medium">
                        Critical Health Data for First Responders
                    </p>
                </div>
            </div>

            {/* QUICK ACTIONS SECTION */}
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={handleSendLocation}
                    disabled={isLocating}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-70"
                >
                    <MapPin
                        size={24}
                        className={isLocating ? "animate-bounce" : ""}
                    />
                    {isLocating
                        ? "Fetching Location..."
                        : "SEND CURRENT LOCATION TO CONTACTS"}
                </button>
            </div>

            {/* Public Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                        Patient Name
                    </label>
                    <div className="text-lg font-bold text-slate-900">
                        {profile.fullName}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                        Blood Type
                    </label>
                    <div className="text-2xl font-black text-red-600">
                        {profile.bloodType || "Unknown"}
                    </div>
                </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-800 text-white flex items-center gap-2 font-bold">
                    <Phone size={18} /> Emergency Contacts
                </div>
                <div className="divide-y divide-slate-100">
                    {profile.emergencyContacts.map((contact, i) => (
                        <div
                            key={i}
                            className="p-4 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-bold text-slate-900">
                                    {contact.name}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {contact.relationship}
                                </div>
                            </div>
                            <a
                                href={`tel:${contact.phone}`}
                                className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                            >
                                <Phone size={16} /> Call
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* PROTECTED SECTION */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase px-1 flex items-center gap-2">
                    {isLocked ? <Lock size={14} /> : <Unlock size={14} />}{" "}
                    Medical History
                </h2>

                {isLocked ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
                        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <Lock className="text-slate-400" size={28} />
                        </div>
                        <h3 className="font-bold text-slate-900">
                            Information Locked
                        </h3>
                        {!showOtpInput ? (
                            <button
                                onClick={handleRequestOtp}
                                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto"
                            >
                                <KeyRound size={18} /> Request Access OTP
                            </button>
                        ) : (
                            <div className="max-w-xs mx-auto space-y-3">
                                <input
                                    type="text"
                                    placeholder="Enter 1234"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full p-3 border-2 border-blue-100 rounded-xl text-center text-xl font-bold tracking-widest outline-none"
                                />
                                {error && (
                                    <p className="text-red-500 text-xs font-bold">
                                        {error}
                                    </p>
                                )}
                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
                                >
                                    Verify & Unlock
                                </button>
                                <button
                                    onClick={() => setShowOtpInput(false)}
                                    className="text-xs text-slate-400 underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in duration-500">
                        {[
                            {
                                label: "Allergies",
                                data: profile.allergies,
                                icon: (
                                    <AlertTriangle className="text-red-500" />
                                ),
                                bgColor: "bg-red-50",
                            },
                            {
                                label: "Current Medications",
                                data: profile.medications,
                                icon: <Info className="text-blue-500" />,
                                bgColor: "bg-blue-50",
                            },
                            {
                                label: "Chronic Conditions",
                                data: profile.conditions,
                                icon: (
                                    <ShieldCheck className="text-green-500" />
                                ),
                                bgColor: "bg-green-50",
                            },
                            {
                                label: "Insurance",
                                data: profile.insuranceProvider,
                                icon: (
                                    <ShieldCheck className="text-indigo-500" />
                                ),
                                bgColor: "bg-indigo-50",
                            },
                            {
                                label: "Policy Number",
                                data: profile.insurancePolicyNumber,
                                icon: <FileText className="text-slate-500" />,
                                bgColor: "bg-slate-100",
                            },
                            {
                                label: "Additional Notes",
                                data: profile.additionalNotes,
                                icon: <Info className="text-yellow-600" />,
                                bgColor: "bg-yellow-50",
                            },
                        ].map(({ label, data, icon, bgColor }) => {
                            const content = renderContent(data)
                            if (!content) return null
                            return (
                                <div
                                    key={label}
                                    className="bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-sm"
                                >
                                    <div
                                        className={`p-4 ${bgColor} flex items-center gap-2 font-bold text-slate-800`}
                                    >
                                        {icon} {label}
                                    </div>
                                    <div className="p-4">{content}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmergencyView
