import React, { useState } from "react"
import { MedicalProfile, EmergencyContact, BloodType } from "../types"
import {
    Plus,
    Trash2,
    Save,
    User,
    Heart,
    AlertCircle,
    ShieldCheck,
} from "lucide-react"

interface Props {
    initialData: MedicalProfile | null
    onSave: (data: MedicalProfile) => void
}

const BLOOD_TYPES: BloodType[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
]

const EMPTY_PROFILE: MedicalProfile = {
    id: "",
    fullName: "",
    dateOfBirth: "",
    bloodType: "" as BloodType,
    allergies: [],
    medications: [],
    conditions: [],
    organDonor: false,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    emergencyContacts: [{ name: "", relationship: "", phone: "" }],
    additionalNotes: "",
}

const MedicalForm: React.FC<Props> = ({ initialData, onSave }) => {
    const [profile, setProfile] = useState<MedicalProfile>(
        initialData || EMPTY_PROFILE,
    )

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value, type } = e.target
        const val =
            type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        setProfile((prev) => ({ ...prev, [name]: val }))
    }

    const handleArrayChange = (
        field: keyof Pick<
            MedicalProfile,
            "allergies" | "medications" | "conditions"
        >,
        index: number,
        value: string,
    ) => {
        const updated = [...profile[field]]
        updated[index] = value
        setProfile((prev) => ({ ...prev, [field]: updated }))
    }

    const addItem = (
        field: keyof Pick<
            MedicalProfile,
            "allergies" | "medications" | "conditions"
        >,
    ) => {
        setProfile((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
    }

    const removeItem = (
        field: keyof Pick<
            MedicalProfile,
            "allergies" | "medications" | "conditions"
        >,
        index: number,
    ) => {
        setProfile((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }))
    }

    const handleContactChange = (
        index: number,
        field: keyof EmergencyContact,
        value: string,
    ) => {
        const updated = [...profile.emergencyContacts]
        updated[index] = { ...updated[index], [field]: value }
        setProfile((prev) => ({ ...prev, emergencyContacts: updated }))
    }

    const addContact = () => {
        const lastContact =
            profile.emergencyContacts[profile.emergencyContacts.length - 1]
        if (
            lastContact &&
            !lastContact.name.trim() &&
            !lastContact.phone.trim()
        ) {
            alert("Please fill out the current contact before adding another.")
            return
        }
        setProfile((prev) => ({
            ...prev,
            emergencyContacts: [
                ...prev.emergencyContacts,
                { name: "", relationship: "", phone: "" },
            ],
        }))
    }

    const removeContact = (index: number) => {
        if (profile.emergencyContacts.length <= 1) {
            alert("You must have at least one emergency contact.")
            return
        }
        setProfile((prev) => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.filter(
                (_, i) => i !== index,
            ),
        }))
    }

    const validateAndSave = () => {
        if (!profile.fullName.trim()) {
            alert("Full Name is required.")
            return
        }

        const activeContacts = profile.emergencyContacts.filter(
            (c) =>
                c.name.trim() !== "" ||
                c.relationship.trim() !== "" ||
                c.phone.trim() !== "",
        )

        if (activeContacts.length === 0) {
            alert("Please provide at least one emergency contact.")
            return
        }

        const incompleteContact = activeContacts.find(
            (c) => !c.name.trim() || !c.phone.trim(),
        )

        if (incompleteContact) {
            alert(
                `Contact "${incompleteContact.name || "Unknown"}" is missing a phone number or name.`,
            )
            return
        }

        // Clean up empty strings from arrays before saving
        const cleanedProfile = {
            ...profile,
            emergencyContacts: activeContacts,
            allergies: profile.allergies.filter((i) => i.trim() !== ""),
            medications: profile.medications.filter((i) => i.trim() !== ""),
            conditions: profile.conditions.filter((i) => i.trim() !== ""),
        }

        onSave(cleanedProfile)
    }

    return (
        <div className="space-y-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Header for New Users */}
            {!initialData && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                    <AlertCircle className="text-blue-600 shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-900">Welcome!</h3>
                        <p className="text-sm text-blue-700">
                            Please complete your medical profile to generate
                            your QR code.
                        </p>
                    </div>
                </div>
            )}

            {/* Basic Info */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600 font-semibold mb-2">
                    <User size={20} />
                    <h2 className="text-lg">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={profile.dateOfBirth}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Blood Type
                        </label>
                        <select
                            name="bloodType"
                            value={profile.bloodType}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select...</option>
                            {BLOOD_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                        <input
                            type="checkbox"
                            id="organDonor"
                            name="organDonor"
                            checked={profile.organDonor}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label
                            htmlFor="organDonor"
                            className="text-sm font-medium text-slate-700"
                        >
                            Organ Donor
                        </label>
                    </div>
                </div>
            </section>

            {/* Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    {
                        key: "allergies",
                        label: "Allergies",
                        icon: (
                            <AlertCircle className="text-red-500" size={18} />
                        ),
                    },
                    {
                        key: "medications",
                        label: "Medications",
                        icon: <Heart className="text-pink-500" size={18} />,
                    },
                    {
                        key: "conditions",
                        label: "Conditions",
                        icon: (
                            <ShieldCheck className="text-green-500" size={18} />
                        ),
                    },
                ].map(({ key, label, icon }) => (
                    <section key={key} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                {icon}
                                <span>{label}</span>
                            </div>
                            <button
                                onClick={() => addItem(key as any)}
                                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Plus size={18} className="text-blue-600" />
                            </button>
                        </div>
                        {(profile[key as keyof MedicalProfile] as string[]).map(
                            (item, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) =>
                                            handleArrayChange(
                                                key as any,
                                                idx,
                                                e.target.value,
                                            )
                                        }
                                        placeholder={`Add ${label.toLowerCase()}...`}
                                        className="flex-1 text-sm p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none"
                                    />
                                    <button
                                        onClick={() =>
                                            removeItem(key as any, idx)
                                        }
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ),
                        )}
                    </section>
                ))}
            </div>

            {/* Emergency Contacts */}
            <section className="space-y-4">
                <div className="flex items-center justify-between text-blue-600 font-semibold mb-2">
                    <div className="flex items-center gap-2">
                        <Heart size={20} />
                        <h2 className="text-lg">Emergency Contacts</h2>
                    </div>
                    <button
                        onClick={addContact}
                        className="flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <Plus size={16} /> Add Contact
                    </button>
                </div>
                <div className="space-y-3">
                    {profile.emergencyContacts.map((contact, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 border border-slate-100 rounded-xl bg-slate-50/50"
                        >
                            <input
                                placeholder="Name"
                                value={contact.name}
                                onChange={(e) =>
                                    handleContactChange(
                                        idx,
                                        "name",
                                        e.target.value,
                                    )
                                }
                                className="p-2 border border-slate-200 rounded-lg outline-none"
                            />
                            <input
                                placeholder="Relationship"
                                value={contact.relationship}
                                onChange={(e) =>
                                    handleContactChange(
                                        idx,
                                        "relationship",
                                        e.target.value,
                                    )
                                }
                                className="p-2 border border-slate-200 rounded-lg outline-none"
                            />
                            <div className="flex gap-2">
                                <input
                                    placeholder="Phone"
                                    value={contact.phone}
                                    onChange={(e) =>
                                        handleContactChange(
                                            idx,
                                            "phone",
                                            e.target.value,
                                        )
                                    }
                                    className="flex-1 p-2 border border-slate-200 rounded-lg outline-none"
                                />
                                <button
                                    onClick={() => removeContact(idx)}
                                    className="p-2 text-slate-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Insurance & Notes */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Insurance
                    </h2>
                    <div className="space-y-3">
                        <input
                            name="insuranceProvider"
                            placeholder="Provider Name"
                            value={profile.insuranceProvider}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                        />
                        <input
                            name="insurancePolicyNumber"
                            placeholder="Policy Number"
                            value={profile.insurancePolicyNumber}
                            onChange={handleChange}
                            className="w-full p-2 border border-slate-200 rounded-lg outline-none"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-700">
                        Additional Notes
                    </h2>
                    <textarea
                        name="additionalNotes"
                        placeholder="Special instructions, DNR status, etc."
                        value={profile.additionalNotes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-slate-200 rounded-lg outline-none resize-none"
                    />
                </div>
            </section>

            <button
                onClick={validateAndSave}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
            >
                <Save size={20} />
                Save & Update Profile
            </button>
        </div>
    )
}

export default MedicalForm
