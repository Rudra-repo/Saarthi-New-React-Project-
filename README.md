# सaarthi (Saarthi)

**Saarthi** is an AI-powered, multilingual civic welfare platform designed to radically simplify how citizens discover, understand, and apply for government schemes, local benefits, and employment opportunities in India. Built with a mobile-first approach, it features intelligent AI parsing to connect everyday problems ("I lost my job") to tangible government solutions.

---

## 🌟 Key Features

* **🤖 AI-Powered Discovery**: Users simply type their situation in natural language (e.g., "I am a widow" or "नौकरी छूट गई"). The integrated Gemini/Groq AI engine categorizes the distress signal and instantly dynamically hooks up relevant schemes and live local job opportunities.
* **🌐 True Bilingual Support**: Full, deep translation across the platform in both English and Hindi. The entire scheme database, UI components, and even the AI prompt directives swap seamlessly to cater to regional users.
* **📂 Smart Scheme Engine**: Contains a deeply curated, categorized engine of over 40+ National & State-level schemes spanning:
  * Agriculture & Farmers (KCC, PM-KISAN)
  * Health (Ayushman Bharat, PM Surakshit Matritva)
  * Women & Child Development (Widow Pensions, Beti Bachao)
  * Employment & Skilling (NCS, MGNREGA, DDU-GKY)
* **💼 Earn & Work Hub**: A dedicated section to find unskilled/semi-skilled private jobs, skill training courses (Skill India/PMKVY), wage tables for state laborers, and AI-suggested local self-employment ideas based on user skills.
* **📱 Progressive Onboarding**: Frictionless access to critical information. Users can browse everything without an account, but standard Firebase Auth (Email & Google) is available for those who want to save schemes and track their applied job forms to their personal dashboard.
* **🌐 Resilient Architecture**: Implements graceful fallbacks (LocalStorage & SessionStorage caching) that ensure users can still view saved schemes and stories even under poor network conditions or Firebase quota limits.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React (Vite)
* **Styling**: TailwindCSS (Vibrant, accessible, mobile-responsive UI design)
* **Routing**: React Router DOM
* **Database & Auth**: Firebase (Authentication, Cloud Firestore)
* **AI Integration**: Google Gemini API (with Groq fallback)
* **Icons**: React Icons (Heroicons/Lucide styling)
* **Alerts**: React Toastify

---

## 🚀 Getting Started

### Prerequisites

You will need **Node.js** installed and Firebase credentials if you need cloud sync.
You will also need an API key for Google Gemini AI.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rudra-repo/Saarthi-New-React-Project-.git
   cd Saarthi-New-React-Project-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the following keys:
   ```env
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_GEMINI_API_KEY="your-google-gemini-key"
   VITE_GROQ_API_KEY="your-groq-api-key" # Optional fallback
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the platform:**
   Navigate to `http://localhost:5173` in your browser.

---

## 📂 Project Structure

\`\`\`
src/
├── components/       # Reusable UI components (Navbar, SchemeCard, ChatBox)
├── context/          # React Contexts (AuthContext, LanguageContext, UserContext)
├── pages/            # Main application views (Home, Schemes, Earn, Dashboard)
├── services/         # External integrations (firebase.js, aiService.js)
├── constants/        # Centralized data (schemes database, UI translations)
├── App.jsx           # Main Application Router
└── index.css         # Global Tailwind directives
\`\`\`

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See \`LICENSE\` for more information.
