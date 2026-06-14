# AI Usage Report

Building this shared expenses app in just two days was a challenge, so I relied heavily on AI as my primary pair programmer. I mainly used Gemini 3.1 Pro. While it was incredibly helpful for scaffolding boilerplate and setting up Tailwind styling quickly, I still had to stay heavily involved to steer its architectural decisions and fix a few of its mistakes.

Here's a breakdown of how I used AI and where I had to step in.

## AI Tools Used
- **Gemini 3.1 Pro (High)** for generating the Node.js/Sequelize backend structure, Vite/React setup, and assisting with the initial CSV parsing logic.

## Key Prompts Used
To get things moving quickly, I used some core prompts:
1. "I need you to act as my pair programmer. Let's scaffold a MERN stack application (which we later migrated to PostgreSQL) that can parse a CSV file of shared expenses."
2. "We have an expenses CSV with a lot of dirty data—missing names, weird dates, USD and INR mixed up. Help me write a robust JavaScript parser using `csv-parser` that logs every anomaly it finds instead of just failing."
3. "Create a premium, modern React frontend component using Tailwind CSS and Lucide icons for the CSV upload interface. It needs to show a clear anomaly log."

## Cases Where the AI Was Wrong & How I Fixed It

As great as the AI was, I had to catch and fix a few things where it went off track:

1. **The Database Constraint Contradiction**
   - **What the AI did:** When discussing the stack, the AI got confused between my initial MERN stack request and the assignment's strict "relational DBs only" requirement. It initially built everything out using Mongoose (MongoDB).
   - **How I fixed it:** I realized this wouldn't meet the core project requirements. I had to explicitly instruct the AI to rip out Mongoose, install PostgreSQL (`pg` and `sequelize`), and rewrite all the schemas with proper relational tables (like splitting `ExpenseSplits` into its own table with foreign keys). 

2. **TailwindCSS Configuration Hiccups**
   - **What the AI did:** The AI scaffolded the Vite React app and added Tailwind, but the styling wasn't applying at all. It forgot to generate the necessary `postcss.config.js` file during initialization.
   - **How I fixed it:** I had to manually create the `postcss.config.js` and wire up the `tailwindcss` and `autoprefixer` plugins so the CSS would actually compile.

3. **PowerShell Command Failures**
   - **What the AI did:** When trying to quickly install multiple backend and frontend dependencies at once, the AI kept trying to chain terminal commands using `&&` (e.g., `npm install && npm install cors`). This completely broke in my Windows PowerShell environment.
   - **How I fixed it:** I recognized the syntax error and either ran the commands manually one by one, or swapped the `&&` operators for semicolons (`;`) to get the installations to finish successfully.
