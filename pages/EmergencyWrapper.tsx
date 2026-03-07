import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { MedicalProfile } from "../types"
import EmergencyView from "../components/EmergencyView"

const EmergencyWrapper: React.FC = () => {
    const { id } = useParams()
    const [profile, setProfile] = useState<MedicalProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return
            try {
                const snap = await getDoc(doc(db, "users", id))
                if (snap.exists()) setProfile(snap.data() as MedicalProfile)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [id])

    if (loading)
        return (
            <div className="p-10 text-center font-bold">
                Loading Emergency Data...
            </div>
        )
    if (!profile)
        return (
            <div className="p-10 text-center text-red-500">
                Profile Not Found
            </div>
        )

    return <EmergencyView profile={profile} />
}

export default EmergencyWrapper
