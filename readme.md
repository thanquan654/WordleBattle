# Wordle Battle

A real-time multiplayer Wordle Battle application. Challenge your friends or play with bots in this competitive twist on the classic word puzzle game.

## 🌟 Features

-   **Multiplayer Gameplay:** Real-time battles using Socket.io.
-   **Game Rooms:** Create and join public or private lobbies.
-   **Bot Integration:** Play with AI-assisted hints or against bot opponents.
-   **Leaderboards:** Track scores and round winners dynamically.
-   **Responsive Design:** Built with React, Tailwind CSS, and Framer Motion for smooth animations.

## 🛠 Tech Stack

### Frontend

-   **Framework:** React (Vite)
-   **Language:** TypeScript
-   **State Management:** Redux Toolkit
-   **Styling:** Tailwind CSS, Radix UI
-   **Animations:** Framer Motion, React Confetti
-   **Communication:** Socket.io Client
-   **Audio:** Howler.js

### Backend

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (Mongoose)
-   **Communication:** Socket.io
-   **Architecture:** Controller-Service-Repository pattern (simplified)

## 📋 Prerequisites

Ensure you have the following installed:

-   **Node.js** (v18 or higher)
-   **npm** or **yarn**
-   **MongoDB** (running locally or via MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/thanquan654/WordleBattle.git
cd WordleBattle
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
BACKEND_URL=http://localhost:3001
MONGODB_URI=mongodb://localhost:27017/wordle-battle
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm run dev
```

Visit `http://localhost:5173` (or the port shown in your terminal) to play!

## 📂 Project Structure

```
WordleBattle/
├── backend/            # Express server & Game logic
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── helpers/     # Game logic & dictionary tools
│   │   ├── lib/         # Database & Socket setup
│   │   ├── routers/     # API routes
│   │   └── schemas/     # Mongoose models
│   └── wordsList.txt    # Dictionary source
│
└── frontend/           # React client
    ├── src/
    │   ├── apis/       # API services
    │   ├── components/ # UI Components (Game, Lobby, Home)
    │   ├── context/    # React Contexts
    │   ├── hooks/      # Custom Hooks (Socket, Game logic)
    │   ├── page/       # Main Route Pages
    │   └── store/      # Redux Slices
```
