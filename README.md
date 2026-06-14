# Shared Expenses App

A PERN stack application built to track shared expenses, handle varying splits, calculate balances, and seamlessly import complex CSV data with anomaly detection.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Local or Hosted)
- Git

### Backend Setup
1. Navigate to the \`backend\` directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the server (runs on port 5000):
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup
1. Navigate to the \`frontend\` directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Architecture & Deployment
- **Frontend**: React (Vite), TailwindCSS, deployed to Vercel.
- **Backend**: Node.js, Express, deployed to Render.
- **Database**: PostgreSQL (via Sequelize ORM).

## AI Used
Developed with the assistance of Gemini 3.1 Pro via Antigravity IDE. See `AI_USAGE.md` for details.
