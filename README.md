FraudLens AI 🛡️

AI-Powered Payment Risk & Fraud Intelligence Platform

FraudLens AI is a full-stack web application designed to analyze payment transactions, calculate fraud risk, detect suspicious activity, and provide security insights through an interactive dashboard.

🌐 Live Website

👉 Open FraudLens AI

✨ Features

🔐 User Authentication — Register/Login with JWT-based authentication and protected routes.

🤖 AI Transaction Analysis — Analyze transaction details and generate risk scores and risk levels.

💳 Transaction Management — View merchant, category, payment method, frequency, device, status and risk information.

🚨 Risk Alerts — Dynamic alerts generated from real transactions with Critical, High and Medium severity.

📋 Audit Logs — Security activity generated from analyzed transactions.

📊 Security Dashboard — Transaction count, high-risk transactions, fraud prevented and current risk insights.

🛠️ Tech Stack

Frontend

React

Vite

React Router

CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcryptjs

Deployment

Railway

MongoDB Atlas

GitHub

🏗️ Project Structure

FraudLensAI/
├── backend/
│   ├── routes/
│   ├── models/
│   ├── components/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── ...
│
├── package.json
└── README.md

🚀 Run Locally

1. Clone the repository

git clone https://github.com/mansiy07/FraudLensAI.git
cd FraudLensAI

2. Install dependencies

npm install
npm install --prefix backend
npm install --prefix frontend

3. Configure environment variables

Create:

backend/.env

Add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

Never commit .env files or real secrets to GitHub.

4. Start the backend

cd backend
npm start

5. Start the frontend

In another terminal:

cd frontend
npm run dev

The local frontend will normally run at:

http://localhost:5173

📦 Production Build

npm run build
npm start

🔒 Security

Passwords are hashed using bcryptjs.

Authentication uses JWT.

Environment secrets are stored in .env.

.env files are excluded from Git tracking.

🎯 Purpose

FraudLens AI demonstrates how a modern full-stack application can combine transaction analysis, risk scoring, fraud alerts, authentication, and security monitoring into one platform.

👩‍💻 Author

Mansi Yadav

GitHub: @mansiy07

⭐ If you find this project useful, consider giving it a star on GitHub.