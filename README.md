# FraudLens AI 🛡️

## AI-Powered Payment Risk & Fraud Intelligence Platform

FraudLens AI is a full-stack web application designed to analyze payment transactions, calculate fraud risk, detect suspicious activity, and provide security insights through an interactive dashboard.

---

## 🌐 Live Website

👉 **[Open FraudLens AI](https://fraudlensai.up.railway.app/)**

---

## ✨ Features

- 🔐 **User Authentication** — Register/Login with JWT-based authentication and protected routes.
- 🤖 **AI Transaction Analysis** — Analyze transaction details and generate risk scores and risk levels.
- 💳 **Transaction Management** — View merchant, category, payment method, frequency, device, status, and risk information.
- 🚨 **Risk Alerts** — Dynamic alerts generated from real transactions with Critical, High, and Medium severity.
- 📋 **Audit Logs** — Security activity generated from analyzed transactions.
- 📊 **Security Dashboard** — View transaction count, high-risk transactions, fraud prevented, and current risk insights.

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Deployment & Tools

- Railway
- MongoDB Atlas
- GitHub

---

## 🏗️ Project Structure

```text
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