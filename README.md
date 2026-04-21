# Saarthi (सaarthi) – AI-Powered Civic Welfare Platform
**Building Web Applications with React – End Term Project**

A full-stack AI-powered multilingual civic welfare platform built using React and Backend-as-a-Service (Firebase).  
This application helps citizens overcome bureaucratic friction by providing personalized scheme discovery, immediate language translation, and real-time AI-powered assistance for government services.

---

## Project Details
- **Submission by:** Rudra Pratap Singh
- **Roll No:** 10236
- **Student Mail Id:** [PENDING USER UPDATE]
- **Course:** Building Web Applications with React
- **Batch:** [PENDING USER UPDATE]

---

## Problem Statement

Vulnerable populations preparing to apply for government schemes or local jobs often struggle with unstructured bureaucratic information due to scattered resources across various State and Central portals.

They face three major challenges:

- Difficulty in deciding which schemes they are eligible for and how to apply
- Density of administrative language (complex English/Hindi)
- No instant digital support for clearing doubts during the application phase

As a result:
- Citizens waste time switching between multiple government websites
- Feel overwhelmed by sheer volume of documents required
- Resort to physical middlemen instead of direct benefits

---

## Target Users

- Vulnerable Citizens (Widows, senior citizens, disabled individuals)
- Rural Populations (Farmers seeking agricultural loans/wages, MGNREGA)
- Unemployed Youth & Laborers
- Low-Digital-Literacy Users needing simple natural language inputs

---

## Solution – Saarthi

A smart web application that acts as a digital "Charioteer", enhancing civic welfare discovery through:

- Personalized AI Scheme Discovery
- Real-time intelligent Eligibility Matrix Filtering
- AI assistance for Natural Language distress input

The platform focuses on unstructured data transformation, offline resilience, and empathetic intelligent assistance.

---

## Theme Focus – Civic Tech & Welfare

### Theme
AI-powered platform for democratizing access to government schemes and local employment.

### What Users Can Do
- Simply type or dictate their distress ("I lost my job", "मेरी फसल बर्बाद हो गई").
- Get an instantly categorized list of relevant government schemes.
- Browse the Earn & Work hub for local labor, private jobs, or self-employment ideas.
- Save schemes and track job form applications in a persistent dashboard.

### Why This Theme Works
- Solves a massive, real-world socio-economic problem.
- Integrates AI meaningfully for empathetic NLP resolution rather than a standard chatbot.
- Combines discovery, tracking, and localized translation in one system.
- Demonstrates strong frontend (React) and backend (Firebase) integration.

---

## Core Features

### AI Discovery Engine
- Natural language distress input.
- Empathetic responses using Google Gemini API (with Groq fallback).
- Categorizes distress directly to database sectors like 'agriculture', 'women', 'job'.

---

### Scheme Catalog & Eligibility Matrix
- Deeply categorized database of 40+ Central and State schemes.
- Dynamically cross-references user profile attributes against scheme metadata.
- Optimistic UI display defaults to showing schemes when data is missing.

---

### The Earn & Work Hub
- Integration for localized state-wise wage distributions (MGNREGA).
- Private local job postings.
- AI self-employment suggestion based on baseline skills.

---

### Dashboard
- Displays saved schemes and jobs.
- Tracks applied government form statuses.
- Local Storage fallbacks for offline-resilience during poor network conditions.

---

### Authentication System
- User Signup / Login
- Protected Routes
- User-specific data storage via Firebase Auth

---

### Persistent Data (CRUD)
- Save and update relevant tracked schemes
- Store job history
- Local community story publishing and sync

---

## React Concepts Used

### Core Concepts
- Functional Components
- Props and Component Composition
- useState (State Management)
- useEffect (Side Effects)
- Conditional Rendering
- Lists and Keys

### Intermediate Concepts
- Lifting State Up
- Controlled Components
- React Router (Routing)
- Context API (Global State: `AuthContext`, `LanguageContext`, `UserContext`)

### Advanced Concepts
- Graceful API Fallbacks (Gemini -> Groq DLs)
- Optimistic UI updates
- Local Storage synchronization and Offline Handling

---

## Tech Stack

### Frontend
- React (Vite / CRA)
- React Router
- Context API

### Backend / Services
- Firebase / Supabase
  - Authentication
  - Database

### UI / Styling
- Tailwind CSS (or chosen library)
- Responsive Design

---

## Project Structure
```text
Saarthi-New-React-Project-
│
├── public
│ └── index.html
│
├── src
│ ├── components # Reusable UI components
│ ├── pages # Route-based pages
│ ├── hooks # Custom hooks
│ ├── context # Global state management
│ ├── services # API and backend logic
│ ├── utils # Helper functions
│ ├── assets # Images / icons
│ ├── App.jsx # Main app component
│ └── main.jsx # Entry point
│
├── .env # Environment variables
├── package.json
├── PRD.md
└── README.md
```

---

## Application Flow

1. User lands on Home (no login needed)
2. Toggles preferred language (English/Hindi)
3. Types a problem ("I need money for daughter's wedding") in the AI box
4. AI responds empathetically and connects relevant schemes
5. User logs in (Auth) to save schemes or track job applications
6. User browses 'Earn' hub for immediate wage info and self-employment AI advice
7. User accesses Dashboard to see saved items even with poor connectivity

---

## Demo Video
https://drive.google.com/file/d/1MJLy4IP2g8NYjp9bQ0bsT1cTU2aDZlUK/view?usp=drive_link

---

## UI / UX Design

- Vibrant, accessible, and inclusive design system
- Bilingual UI components swapping seamlessly
- Responsive across devices
- Progressive disclosure (features available without friction)
- Resilient states (handling API quotas or offline gracefully)

---

## Known Limitations

- AI responses depend heavily on Gemini/Groq uptime and limits
- Requires internet connection for AI context, though simple lists work offline
- Complete application for schemes still requires external portals

---

## Future Improvements

- Voice Integration (dictating problems instead of typing)
- WhatsApp Bot Extensibility (connecting the core AI logic to a WhatsApp number)
- State-targeted scheme filtering
- Auto-filling application PDFs based on user profiles

---

## Evaluation Alignment

This project demonstrates:

- Strong React fundamentals
- Real-world problem solving
- Meaningful AI integration
- Backend integration (Authentication and Database)
- Clean architecture and scalable structure

---

## Academic Integrity

- Built with full understanding of concepts
- No blind AI-generated code used
- All logic implemented and explainable
- Custom tailored to solve friction in civic tech 

---

## Author

**Rudra Pratap Singh**  

---

## Final Note

This project is designed as a portfolio-level application, not just an academic submission.

It demonstrates the ability to:
- Solve real-world problems
- Build scalable React applications
- Integrate AI into citizen workflows
