# 📑 Product Requirements Document (PRD) - Saarthi (सaarthi)

## 1. Project Overview
**Saarthi** is an AI-powered, multilingual civic welfare and employment platform built to radically simplify how citizens in India discover, trace, and claim their entitled government benefits and local jobs. It acts as a digital "Charioteer" (Saarthi), guiding users through the complex bureaucratic landscape using natural language processing.

## 2. Problem Statement
Millions of citizens miss out on life-saving government schemes, subsidies, and employment opportunities simply because they are unaware of them, or find the eligibility criteria too difficult to parse. Navigating different portals across State and Central governments, usually in complex English or dense administrative Hindi, creates massive friction for the most vulnerable populations (farmers, widows, rural youth, and the disabled).

## 3. Target Audience & Profiles
The platform is built around maximum inclusivity, targeting primarily:
*   **Vulnerable Citizens**: Widows, disabled individuals (Divyangjan), and senior citizens.
*   **Rural Populations**: Farmers impacted by drought/floods, seeking KCC loans or MGNREGA wages.
*   **Unemployed Youth & Laborers**: Seeking private local jobs, government skill training (PMKVY), or immediate daily wage labor.
*   **Low-Digital-Literacy Users**: Users who need to simply type or dictate "I need money for my daughter's wedding" instead of digging through dropdown menus.

## 4. Core Features & Architecture

### 4.1. AI-Powered Discovery Engine ('The Brain')
*   **Natural Language Input**: Users express their distress directly (e.g., "I lost my job" or "मेरी फसल बर्बाद हो गई"). 
*   **Empathetic NLP Resolution**: A deeply prompted Google Gemini LLM processes the text. It computes:
    1. A highly empathetic, personalized 2-sentence conversational response.
    2. Exact scheme categorizations (mapping user distress to internal system categories like `job`, `agriculture`, `women`).
    3. Immediate next-action steps.
*   **Fail-Safe Engine**: If the primary AI engine hits a rate limit, the system gracefully and invisibly falls back to a secondary Groq LLaMa-3 infrastructure without the user noticing.

### 4.2. Global Eligibility Matrix
*   **Intelligent Filtering**: The platform dynamically cross-references user profile attributes (Age, Gender, Occupation, Income Level, State) against the hardcoded metadata of over 40+ schemes.
*   **Optimistic Display**: If a user's data is incomplete (e.g., "Unknown" gender or occupation), the system defaults to *showing* the scheme rather than hiding it, ensuring users are never prematurely blocked from viewing a potentially valid benefit.

### 4.3. The Scheme Catalog
A heavily audited database of Central and State schemes categorized deeply by:
*   **Farmer/Agriculture**: PM-KISAN, KCC, Fasal Bima Yojana.
*   **Women & Children**: Beti Bachao Beti Padhao, Swadhar Greh, Maternity Benefits.
*   **Employment & Skilling**: DDU-GKY, PMEGP, ABRY.
*   **Health & Housing**: PMAY-G, Ayushman Bharat.
Each scheme contains normalized instructions, exact document requirements, precise eligibility variables, and verified external official URLs.

### 4.4. The Earn & Work Hub
*   **MGNREGA Integration**: Displays localized state-wise wage distributions.
*   **Skill Training Validation**: Promotes subsidized government upskilling through Skill India/PMKVY.
*   **Private Job Postings**: Matches un-skilled and semi-skilled laborers with local delivery, factory, and construction jobs.
*   **AI Self-Employment Suggestion**: Users input their baseline skills ("I know how to stitch and cook"), and the AI outputs hyper-local local business ideas that they can start immediately safely from home.

### 4.5. Offline / Resilience Mechanisms
*   Given that the target audience may have poor connectivity, the platform relies heavily on **Local Storage Fallbacks**. 
*   Community stories, saved schemes, and applied jobs are synchronized locally. If the cloud database (Firebase Firestore) is inaccessible due to network collapse or quota limits, the platform silently degrades to local-only mode, keeping the user experience intact.

### 4.6. Seamless Multilingual Strategy
*   True bilingual toggle (English ↔ Hindi).
*   The translation engine isn't just altering UI strings; it dynamically injects language-specific directives into the AI system prompt, ensuring the AI replies purely natively in the chosen language.

## 5. User Flows

1.  **Onboarding**: User lands on the Home Page -> Can immediately interact with the AI without logging in -> Immediate Value Delivery.
2.  **Job Hook Intervention**: If the AI detects phrases like "lost my job" or "unemployed", it injects a highly visible **Action Hook** prompting the user to navigate to the *Earn & Work* Hub immediately.
3.  **Account Creation**: User decides to save a scheme -> Triggered to Login -> Firebase Google/Email authentication.
4.  **Community Sharing**: User benefits from a scheme -> Navigates to Community page -> Writes a success story -> Story is parsed locally and synced to the cloud -> Generates a WhatsApp deep-link to share with friends.

---

## 6. Technical Stack Details
*   **Framework**: React (Vite environment)
*   **Styling**: TailwindCSS (Custom configuration supporting primary/accent theme palettes, customized border radius curves, and fluid transitions).
*   **Backend integration**: Firebase Auth, Firebase Firestore.
*   **AI Tooling**: Google Gemini (`generativelanguage.googleapis.com`), Groq API (`api.groq.com`).
*   **State Management**: Context API (`AuthContext`, `UserContext`, `LanguageContext`).

## 7. Future Roadmap
*   **Voice Integration**: Implement Web Speech API to allow users to dictate problems verbally instead of typing.
*   **WhatsApp Bot Extensibility**: Expose the AI Engine via a serverless function to integrate with a WhatsApp Business number.
*   **State-Targeted Filters**: Expand the database filtering to specifically highlight State-exclusive schemes (e.g., Karnataka-only schemes vs. Uttar Pradesh-only schemes).
*   **Scheme Application Auto-Fill**: Auto-generate pre-filled PDFs for offline submission using the user's saved contextual data.
