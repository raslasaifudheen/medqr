import React, { createContext, useContext, useEffect, useState } from "react"
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
    UserCredential,
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import { MedicalProfile } from "../types"

interface AuthContextType {
    user: User | null
    profile: MedicalProfile | null
    loading: boolean
    updateProfile: (
        profile: MedicalProfile,
        uidOverride?: string,
    ) => Promise<void>
    logout: () => Promise<void>
    login: (email: string, password: string) => Promise<UserCredential>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    updateProfile: async () => {},
    logout: async () => {},
    login: async () => {
        throw new Error("AuthContext not initialized")
    },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<MedicalProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true)

            if (firebaseUser) {
                const ref = doc(db, "users", firebaseUser.uid)
                const snap = await getDoc(ref)

                if (snap.exists()) {
                    setProfile(snap.data() as MedicalProfile)
                } else {
                    setProfile(null)
                }
                // Set user AFTER profile is attempted to be fetched
                setUser(firebaseUser)
            } else {
                setUser(null)
                setProfile(null)
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const updateProfile = async (
        newProfile: MedicalProfile,
        uidOverride?: string,
    ) => {
        const activeUid = uidOverride || user?.uid

        if (!activeUid) {
            throw new Error("No authenticated user found")
        }

        const profileWithId = { ...newProfile, id: activeUid }

        await setDoc(doc(db, "users", activeUid), profileWithId)
        setProfile(profileWithId)
    }

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = async () => {
        try {
            await signOut(auth)
            // setProfile(null) and setUser(null) happen automatically via onAuthStateChanged
        } catch (error) {
            console.error("Logout failed", error)
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, profile, loading, updateProfile, logout, login }}
        >
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
