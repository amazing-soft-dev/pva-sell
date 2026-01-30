# Credexus Market - MERN Stack PVA Marketplace

A full-stack e-commerce application for selling Personal Verified Accounts (PVA). Built with the MERN stack (MongoDB, Express, React, Node.js), this project features a modern UI, an AI-powered chatbot, an Admin Dashboard, and real-time order notifications via Telegram.

## 🚀 Features

-   **Full-Stack Architecture**: React frontend (Vite) + Express/Node.js backend.
-   **Dual Database Mode**: Works with **MongoDB** (Local/Atlas) for persistence, or falls back to **In-Memory** storage if no DB is detected (great for quick testing).
-   **Admin Dashboard**: Secure panel to view orders and update statuses (`/admin`).
-   **AI Chatbot**: Integrated OpenRouter (LLM) support assistant context-aware of the product catalog.
-   **Real-time Notifications**: Telegram alerts sent to the admin when a new order is placed.
-   **Authentication**: JWT-based user registration and login.
-   **PDF Invoicing**: Auto-generated PDF invoices for customers.

## 🛠️ Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **MongoDB** (Optional but recommended for persistence)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/amazing-soft-dev/pva-sell.git
    cd pva-sell
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory by copying the example:
    ```bash
    cp .env.example .env
    ```

4.  **Configure `.env`:**
    Open the `.env` file and update the values:

    *   **Database**: Set `MONGODB_URI` to your local instance or Atlas connection string.
    *   **AI Chat**: Add your `OPENROUTER_API_KEY`.
    *   **Telegram**:
        1.  Message `@BotFather` on Telegram to create a bot and get the `TELEGRAM_BOT_TOKEN`.
        2.  Message your new bot, then visit `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` to find your `id` (this is the `TELEGRAM_CHAT_ID`).
    *   **Admin**: Set a secure `ADMIN_PASSWORD`.

## 🏃‍♂️ Running the Application

You need to run the **Backend Server** and the **Frontend Client** simultaneously.

### 1. Start the Backend Server
Open a terminal and run:
```bash
npm run server
```
*   *Note: If MongoDB is not running, the server will log a warning and switch to In-Memory mode. Data will be lost on restart in this mode.*
*   *Ensure the server is running on port 5000 before starting the frontend.*

### 2. Start the Frontend (Vite)
Open a **new** terminal window and run:
```bash
npm run dev
```
Access the app at `http://localhost:5173/pva-sell/`.

## 🔐 Admin Access

To access the order management dashboard:
1.  Navigate to the **Home Page**.
2.  Scroll to the **Footer**.
3.  Click the small **"Admin"** link under the "Support" column.
4.  Enter the password defined in your `.env` (Default: `admin123`).

## 📂 Project Structure

```
├── components/       # React UI Components (Navbar, Cart, ChatBot, etc.)
├── contexts/         # Global State (User, Cart, Theme)
├── server/           # Backend Logic
│   ├── server.js     # Express App, Routes, & DB Connection
│   └── seedData.js   # Initial Product Data
├── services/         # API Service (Fetch calls to backend)
├── utils/            # Utilities (Router)
├── views/            # Page Views (Home, Products, Admin, Profile)
├── .env              # Environment Variables (Git ignored)
└── index.tsx         # App Entry Point
```

## 📜 License

This project is open-source and available under the MIT License.