# 🫀 SoulEcho — AI Emotional Diary & Reflection Platform

<p align="center">

![Project](https://img.shields.io/badge/PROJECT-SoulEcho-6E6A8F)
![React](https://img.shields.io/badge/React-Frontend-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-TS-blue)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20DB-orange)
![AI Engine](https://img.shields.io/badge/AI-Emotion%20Analysis-purple)
![NLP](https://img.shields.io/badge/NLP-Emotion%20Detection-green)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-yellow)

</p>

### 🌿 A calm digital journaling platform with emotional intelligence, reflection tools, and monthly insight analytics.

---

# ✨ Overview

**SoulEcho** is an intelligent digital journaling platform designed to help users reflect on their thoughts, track emotional patterns, and gain insights into their mental well-being.

The application bridges the gap between **traditional journaling** and **AI-driven emotional reflection**. By combining structured diary writing, emotional analysis, and visual insights, SoulEcho helps users understand their emotional journey over time.

The system is designed with a **calm and elegant UI**, focusing on a distraction-free writing experience and meaningful self-reflection.

---

# 🏗 System Architecture

The project follows a **modern full-stack architecture** combining a React frontend with Firebase backend services and a custom emotional intelligence engine.

```
User Interface (React + TypeScript)
        ↓
Diary Entry Processing
        ↓
Emotion Analysis Engine
        ↓
Firebase Database Storage
        ↓
Monthly Analytics Engine
        ↓
User Insights Dashboard
```

### Core Functionality 🎯

🔍 **Emotion Analysis Engine**
Analyzes diary entries to identify emotional patterns and generate supportive insights.

📅 **Calendar-Based Journaling**
Allows users to view and navigate entries across a monthly calendar.

📊 **Monthly Emotional Insights**
Provides visual analytics on writing patterns and emotional trends.

🔐 **Secure User Accounts**
Authentication and personalized journaling for each user.

---

# 🧩 Core Features

### 🔐 Authentication System

Secure account creation and login using Firebase.

* User signup
* Login / logout
* Session persistence
* Private user data

---

### 📖 Daily Diary Writing

A clean and calming writing environment where users can freely document their thoughts.

Features include:

* distraction-free text editor
* entry saving
* entry editing
* emotional reflection prompts

---

### 📅 Calendar Journal Navigation

Users can easily navigate past entries using a visual calendar.

Capabilities:

* highlight days with entries
* open entries by date
* track journaling consistency

---

### 📜 Entry History

A chronological timeline of previous reflections.

Includes:

* entry previews
* full entry viewing
* quick navigation between entries

---

### 📊 Monthly Insights Dashboard

SoulEcho analyzes journaling activity and displays statistics such as:

* total entries written
* journaling streak
* most active writing days
* weekly entry frequency

Data is visualized using **Recharts** for clarity.

---

# 🎨 Design Philosophy

SoulEcho focuses on **calm, elegant, and minimal design** to create a peaceful writing experience.

Design principles:

🌿 Soft neutral color palette
📖 Comfortable typography for long writing sessions
✨ Elegant minimal interface
🧘 Distraction-free journaling environment

Inspired by:

* Calm meditation apps
* Notion-style minimal layouts
* Elegant journaling platforms

---

# 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router

### Backend / Database

* Firebase Authentication
* Firebase Firestore

### Visualization

* Recharts
* React Calendar

### AI / NLP Engine

* Emotion analysis pipeline
* contextual emotional reasoning
* supportive insight generation

---

# 📂 Project Structure

```
src/

components/
    Navbar
    EntryCard
    CalendarWidget
    StatsCard

pages/
    Dashboard
    WriteEntry
    CalendarView
    EntryHistory
    MonthlyAnalysis
    Login
    Signup

services/
    firebase.ts
    entryService.ts

utils/
    analytics.ts
    emotionEngine.ts
```

---

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/soulecho.git
```

Navigate into the project folder:

```bash
cd soulecho
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application:

```
http://localhost:3000
```

---

# 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

# 🔮 Future Enhancements

Planned improvements include:

* advanced emotional intelligence engine
* mood trend prediction
* AI journaling assistant
* voice journaling
* personalized emotional guidance
* deeper mental wellness insights

---

# 🌍 Vision

SoulEcho aims to become a **digital companion for emotional reflection**, helping users understand their feelings, track their growth, and cultivate emotional awareness through journaling.

---

# 📜 License

This project is licensed under the **MIT License**.
