# 🛡️ MedQr: Emergency Medical Profile

**RescueLink** is a privacy-focused, emergency-first web application designed to provide first responders with critical medical data while keeping sensitive information secure. Users can store their blood type, allergies, medications, and chronic conditions, accessible via a secure OTP-bypass system.

## 🚀 Features

* **Critical Alert Banner**: High-visibility interface for rapid identification in emergency situations.
* **One-Tap Geolocation**: Dedicated button to fetch real-time GPS coordinates and generate a Google Maps link for emergency contacts.
* **Public/Private Data Split**:
    * **Public**: Patient name, blood type, and emergency contacts are immediately visible.
    * **Protected**: Allergies, medications, and insurance data are locked behind a security wall.
* **OTP Verification**: Securely unlock sensitive medical history by requesting an OTP sent to the designated emergency contact (Demo Code: `1234`).
* **Click-to-Call**: Immediate access to dial emergency contacts directly from the UI.
* **Responsive Design**: Optimized for mobile devices, ensuring accessibility on the go.

## 🛠️ Tech Stack

* **Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations**: `tailwindcss-animate`
* **APIs**: Browser Geolocation API

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/yourusername/rescue-link.git](https://github.com/yourusername/rescue-link.git)
    cd rescue-link
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

## 🔒 Security Logic

* **The OTP System**: Designed to ensure only someone with physical access to the patient's phone (to call the contact) or the contact themselves can authorize the release of sensitive medical history.
* **Data Handling**: The application handles both array-based data (lists of allergies) and string-based data (notes/insurance) with a type-safe rendering engine to prevent UI crashes.

## 🗺️ Roadmap

- [ ] **Real SMS Integration**: Connect to Twilio or Firebase to send actual SMS OTPs.
- [ ] **QR Code Generator**: Allow users to generate a QR code that links directly to their Emergency View.
- [ ] **Auto-Lock Timer**: Automatically hide sensitive data after 5 minutes of inactivity.
- [ ] **PWA Support**: Allow the app to be installed on
