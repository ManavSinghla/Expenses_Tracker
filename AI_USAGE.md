# AI Usage

This project was built with the assistance of an AI coding assistant.

## AI Tools Used
- Gemini 3.1 Pro (High) via Antigravity IDE

## Key Prompts Used
1. "Build a Shared Expenses App using MERN stack with an importer for expenses_export.csv."
2. "Create an implementation plan detailing the architecture and anomaly handling policies."
3. "Generate a React frontend using Vite and TailwindCSS for the CSV upload interface with premium aesthetics."

## Cases Where AI Was Wrong & Corrections

1. **Database Contradiction:**
   - *AI Mistake:* The prompt requested "Use relational DBs only", but another part explicitly requested "Use mern stack in this i will deploy this with mongodb atlas".
   - *Correction:* The AI flagged this contradiction in the open questions and proceeded with the explicitly requested MERN stack, while noting that a true relational DB would require a stack switch (e.g., PostgreSQL).
   
2. **Missing Dependencies for PostCSS/Tailwind:**
   - *AI Mistake:* The AI initially configured Tailwind but failed to generate the `postcss.config.js` properly, causing styles to not apply.
   - *Correction:* Detected the missing configuration and manually generated `postcss.config.js` with the correct plugins.

3. **PowerShell Command Syntax:**
   - *AI Mistake:* The AI attempted to chain npm install commands using `&&` which failed in the specific PowerShell version on Windows.
   - *Correction:* Switched to executing the commands with valid PowerShell separators or sequentially.
