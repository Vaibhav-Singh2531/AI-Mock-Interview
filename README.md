# PrepWise AI Mock Interview

PrepWise is an AI-powered mock interview application that helps candidates practice for interviews using a customized Voice Agent and receive instant, structured feedback.

## Architecture

The application is split into two parts running concurrently:
- **Frontend**: React 19 SPA built with Vite and Tailwind CSS.
- **Backend**: Express.js server providing API routes, protected by Firebase Admin.

## Tech Stack

- **Frontend**: React 19, React Router v7, Tailwind CSS, shadcn/ui.
- **Backend**: Express.js, Firebase Admin SDK.
- **AI & Voice**: `@ai-sdk/google` (Gemini API 2.0 Flash) and Vapi (`@vapi-ai/web`).
- **Database & Auth**: Firebase (Auth & Firestore).

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Firebase project with Authentication (Email/Password) and Firestore enabled.
- A Gemini API Key.
- A Vapi API Key.

### 2. Environment Variables
Create a `.env` file in the root of the project with the following keys. Note the `VITE_` prefix for variables that need to be exposed to the React frontend.

```env
# Firebase Client (Frontend)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Firebase Admin (Backend)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-service-account-email"
FIREBASE_PRIVATE_KEY="your-private-key"

# Vapi (Voice Agent)
VITE_VAPI_WEB_TOKEN="your-public-vapi-web-token"
VITE_VAPI_WORKFLOW_ID="your-vapi-workflow-id"

# Google Gemini (AI Feedback & Question Gen)
GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
```

### 3. Installation
Install all dependencies for the workspace.
```bash
npm install
```

### 4. Running the Development Server
This will start both the Vite development server and the Express backend concurrently.
```bash
npm run dev
```

### 5. Building for Production
```bash
npm run build
```
The optimized static build will be output to the `dist/` directory. You will still need to deploy the `server/` separately for backend functionality.
