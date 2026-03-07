import React from "react"
import { Link } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"
import { User, ChevronRight, HeartPulse, QrCode } from "lucide-react"
import { MedicalProfile } from "../types"

const Dashboard: React.FC<{ profile: MedicalProfile }> = ({ profile }) => {
    const qrValue = `${window.location.origin}/#/emergency/${profile.id}`

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Quick Status */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {profile.fullName}
                                </h2>
                                <p className="text-slate-500">
                                    ID: {profile.id}
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/edit"
                            className="flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                        >
                            Edit Profile <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                                Blood Type
                            </div>
                            <div className="text-2xl font-black text-red-500">
                                {profile.bloodType}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                                Contacts
                            </div>
                            <div className="text-2xl font-black text-slate-800">
                                {profile.emergencyContacts.length}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 sm:col-span-1">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                                Donor
                            </div>
                            <div className="text-2xl font-black text-green-500">
                                {profile.organDonor ? "Yes" : "No"}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-2xl text-white relative overflow-hidden shadow-xl shadow-blue-200">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">
                                Did you know?
                            </h3>
                            <p className="opacity-90 leading-relaxed text-sm">
                                In a road accident, the first 60 minutes (the
                                "Golden Hour") are critical. Having your medical
                                records immediately available can save up to 40%
                                more time for life-saving triage.
                            </p>
                        </div>
                        <HeartPulse className="absolute -right-8 -bottom-8 opacity-10 w-48 h-48" />
                    </div>
                </div>

                {/* Right: QR Code */}
                <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-50 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        Emergency QR
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Paramedics can scan this to see your profile instantly.
                    </p>

                    <div className="p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-lg mb-6">
                        <QRCodeSVG value={qrValue} size={180} />
                    </div>

                    <div className="space-y-3 w-full">
                        <button
                            onClick={() => window.print()}
                            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            <QrCode size={18} /> Print QR Card
                        </button>
                        <p className="text-xs text-slate-400 px-4">
                            Tip: Print this code and keep it in your wallet or
                            stick it on your mobile case.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
