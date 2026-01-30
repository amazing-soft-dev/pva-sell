# Credexus Market - MERN Stack PVA Marketplace

A full-stack e-commerce application for selling Personal Verified Accounts (PVA). Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚨 Important: Architecture Note

This is a **Full Stack Application**. It consists of two parts that must run simultaneously:
1.  **Frontend**: The React UI (Vite).
2.  **Backend**: The Node.js/Express Server (handles API, Auth, Database, Chatbot).

**Note on GitHub Pages Deployment:**
GitHub Pages only hosts static files (Frontend). It **cannot** run the Node.js backend.
*   If you deploy this to GitHub Pages, the site will load, but API calls (Login, Products, Chat) will fail unless you host the backend properly on a service like Render, Railway, or Heroku and update the API URL.
*   **Recommendation:** For testing, run everything locally on your computer.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB (Optional - app will run in "Memory Mode" without it, but data resets on restart).

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the root folder:
```bash
cp .env.example .env
```
*   (Optional) Update `MONGODB_URI` if you have MongoDB installed.
*   (Optional) Add `OPENROUTER_API_KEY` for the chatbot to work.

### 4. Run the App (The Easy Way)
We have added a script to run both backend and frontend in one command:

```bash
npm run dev:all
```
*   Access App: `http://localhost:5173/pva-sell/`
*   Backend API: `http://localhost:5000`

---

## 🛠️ Manual Run (Separate Terminals)

If you prefer running them separately to see logs clearly:

**Terminal 1 (Backend):**
```bash
npm run server
```
*Wait until you see "Server running on port 5000"*

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 📂 Project Structure

*   `/server`: Node.js Express API, Database models, and Seed data.
*   `/views`: React Pages (Home, Products, Admin, etc.).
*   `/components`: Reusable UI components.
*   `/services`: API fetch functions to talk to the backend.

## 🔐 Admin Access

1.  Go to the website footer.
2.  Click **"Admin"**.
3.  Password: `admin123` (or check your `.env` file).

## 💬 Notifications & Chat

*   **Telegram**: Configure `TELEGRAM_BOT_TOKEN` in `.env` to receive instant order alerts.
*   **AI Chat**: Configure `OPENROUTER_API_KEY` to enable the shopping assistant.
