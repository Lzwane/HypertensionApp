# Hypertension Manager App 🩺💙

A comprehensive mobile application designed to help users in urban and suburban environments manage hypertension effectively. This app centralizes daily self-management tools, ensuring patients stay on top of their health with tracking, reminders, and educational resources.

## 📱 What This App Does

Hypertension Manager acts as a daily health companion, providing a "Local-First" solution for privacy and ease of use. It helps users:

* **Track Vital Signs:** Log daily Blood Pressure readings, monitor sodium intake via food logs, and track physical activity (steps).
* **Manage Medications:** Keep a digital pillbox with dosage instructions and receive daily notifications to take medication.
* **Find Care:** Instantly locate nearby pharmacies using GPS when refills are needed or while traveling.
* **Stay Informed:** Learn about heart health through daily tips and an interactive "BP Master" mini-game.
* **Get Support:** Chat with an empathetic AI assistant for immediate health guidance and reassurance.
* **Stay Safe:** Access a dedicated "Hypertensive Crisis" guide with one-tap emergency calling (112).
* **Share Data:** Generate and share professional health summaries with doctors via WhatsApp or Email.

---

## 🚀 Key Features

### 1. 📊 Daily Tracker Dashboard
A central hub to log and view:
* **Blood Pressure:** Systolic/Diastolic readings with time stamps.
* **Food Diary:** Log meals to monitor salt/sodium intake.
* **Activity:** Automatic step counting using the phone's built-in pedometer sensor.
* **Symptoms:** Track side effects like headaches or dizziness with severity ratings.

### 2. 💊 Medication Reminders
* Add medications with names, dosages, and instructions.
* Toggle daily reminders to receive system notifications (even when the app is closed).
* Visual list to manage active prescriptions.

### 3. 📍 Pharmacy Locator
* Uses device GPS to find the user's current location.
* One-tap search that opens Apple Maps/Google Maps to show the nearest pharmacies for quick refills.

### 4. 📄 Doctor Reports
* Compiles all logged data (BP, Meds, Food) into a clean, text-based report.
* Uses the native system share sheet to send data to clinicians via email or messaging apps.

### 5. 🤖 AI Health Assistant
* A chat interface providing immediate, simulated responses to health questions.
* Offers advice on diet, symptoms, and lifestyle changes.

### 6. 🚨 Emergency Mode
* A dedicated screen for "Hypertensive Crisis" (BP > 180/120).
* Lists critical symptoms to watch for.
* Includes a direct dial button for Emergency Services (112).

---

## 🛠️ Tech Stack

* **Framework:** React Native (via Expo)
* **Routing:** Expo Router (File-based routing)
* **Storage:** AsyncStorage (Local, offline-first data persistence)
* **Sensors:** Expo Sensors (Pedometer)
* **Location:** Expo Location (GPS)
* **Notifications:** Expo Notifications (Local scheduling)
* **Language:** TypeScript / JavaScript

---

## 🏁 How to Run Locally

Follow these steps to run the app on your own machine.

### Prerequisites
* Node.js installed.
* Expo Go app installed on your physical iOS/Android device.

### Installation

1.  **Clone or Download** this repository.
2.  **Navigate** to the project folder:
    ```bash
    cd HypertensionApp
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running the App

1.  **Start the Expo Server:**
    ```bash
    npx expo start
    ```
    *(Note: If you have connection issues, try `npx expo start --tunnel`)*

2.  **Launch on Phone:**
    * Scan the QR code displayed in the terminal using your iPhone Camera or the Expo Go app (Android).

---

## 🔮 Future Roadmap

This version is an MVP (Minimum Viable Product). Future updates will include:

* **Cloud Sync:** Integration with Firebase/Supabase for multi-device login.
* **Live AI:** Connecting the Chat Assistant to the OpenAI API for real-time medical knowledge.
* **Image Recognition:** AI-powered food analysis from photos to estimate sodium content automatically.
* **App Store Release:** Building standalone binaries (`.ipa` and `.apk`) for public release.

---

**Disclaimer:** This app is a health management tool and does not replace professional medical advice. Always consult a doctor for serious symptoms.