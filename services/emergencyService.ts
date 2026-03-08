import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp,
    deleteDoc,
} from "firebase/firestore"
import { db } from "../firebase" // Adjust path to your firebase config

export const locationService = {
    /**
     * Gets current coordinates and generates a Google Maps WhatsApp link
     */
    async sendLocationWhatsApp(phone: string, patientName: string) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Geolocation is not supported by your browser")
                return
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

                    const message = `📍 EMERGENCY LOCATION: I am with ${patientName}. \n\nMy current location is: ${googleMapsUrl}`
                    const cleanPhone = phone.replace(/\D/g, "")
                    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

                    window.open(whatsappUrl, "_blank")
                    resolve(true)
                },
                (error) => {
                    reject(
                        "Unable to retrieve location. Please check GPS settings.",
                    )
                },
            )
        })
    },
}

export const emergencyService = {
    /**
     * Generates a 6-digit code, saves it to Firestore,
     * and generates a WhatsApp URL.
     */
    async requestAccess(profileId: string, fullName: string, phone: string) {
        const generatedCode = Math.floor(
            100000 + Math.random() * 900000,
        ).toString()
        const cleanPhone = phone.replace(/\D/g, "")

        try {
            // 1. Save to Firestore
            await setDoc(doc(db, "emergency_access", profileId), {
                code: generatedCode,
                createdAt: serverTimestamp(),
                expiresAt: Date.now() + 600000, // 10 minutes from now
            })

            // 2. Prepare WhatsApp Message
            const message = `🚨 EMERGENCY MEDICAL ACCESS 🚨\n\nI am assisting ${fullName}. I need to view their medical history.\n\nPlease provide this code: ${generatedCode}\n\n(Expires in 10 mins)`
            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

            return { success: true, whatsappUrl }
        } catch (error) {
            console.error("Error in requestAccess:", error)
            throw new Error("Failed to initialize emergency request.")
        }
    },

    /**
     * Verifies if the entered OTP matches the one in Firestore.
     */
    async verifyAccess(profileId: string, enteredOtp: string) {
        try {
            const docRef = doc(db, "emergency_access", profileId)
            const docSnap = await getDoc(docRef)

            if (!docSnap.exists())
                return { valid: false, message: "No active request." }

            const { code, expiresAt } = docSnap.data()

            // Check Expiry
            if (Date.now() > expiresAt) {
                await deleteDoc(docRef)
                return { valid: false, message: "Code has expired." }
            }

            // Check Match
            if (code === enteredOtp) {
                await deleteDoc(docRef) // Security: single-use code
                return { valid: true }
            }

            return { valid: false, message: "Incorrect code." }
        } catch (error) {
            console.error("Error in verifyAccess:", error)
            throw new Error("Verification service unavailable.")
        }
    },
}
