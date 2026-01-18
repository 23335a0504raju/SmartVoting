# 🗳️ SmartVoting System

**SmartVoting** is a secure, AI-powered electronic voting platform designed to ensure fair and transparent elections. It features biometric authentication (Face Recognition with Liveness Detection) to prevent impersonation and double-voting, along with a comprehensive Admin Panel for election management.

![SmartVoting Dashboard](https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=1000)

## 🚀 Key Features

### 🔐 Security & Authentication
- **Face Recognition**: Verifies voter identity using AI-based facial embeddings.
- **Liveness Detection**: Prevents spoofing attacks by ensuring the user is physically present (via blink detection).
- **Secure Login**: Two-factor style authentication (Voter ID + Password + Face).

### 👥 User Dashboard
- **Active Elections**: View and participate in ongoing elections.
- **Voting History**: Track past votes and participation stats.
- **Real-Time Results**: View announced election results with interactive charts and graphs.
- **Notification Center**: Stay updated on election statuses.

### 🛠️ Admin Panel
- **Election Management**: Create, Update, and monitor elections.
- **Candidate Management**: Add candidates with symbols/photos.
- **Result Announcement**:
    - **Announce Results**: Publish results to voters.
    - **Withdraw Results**: Temporarily hide results if needed.
- **Voter Verification**: Manage and verify voter registrations.

---

## 🏗️ Technology Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | React.js | Responsive User Interface with Dashboard & Charts |
| **Backend** | Node.js / Express | REST API handling business logic & Auth |
| **AI Engine** | Python (Flask) | Face Recognition (MediaPipe/OpenCV) |
| **Database** | Supabase (PostgreSQL) | Data persistance, Real-time subscriptions & Vector Store |
| **Storage** | Supabase Storage | Storing Candidate Symbols & Voter Images |

---

## ⚙️ Setup & Installation

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Supabase Account

### 1. Database Setup (Supabase)
Create a new Supabase project and execute the provided SQL schema (tables: users, elections, votes, etc.).
Enable **pgvector** extension for face embeddings.

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `/backend`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
AI_ENGINE_URL=http://localhost:5001
```
Start the Server:
```bash
npm start
```

### 3. AI Engine Setup
```bash
cd ai_engine
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
```
Start the AI Engine:
```bash
python main.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```
Start the React App:
```bash
npm start
```

---

## 📖 Usage Guide

1.  **Register**: Users sign up with their details and capture their face for biometric verification.
2.  **Verify**: Admins or Automatic processes verify the user.
3.  **Vote**:
    - User logs in (ID + Password).
    - Selects an Active Election.
    - Performs Liveness Check (Blink).
    - Casts Vote.
4.  **Results**: Once the election is closed and results are **Announced** by the Admin, users can view the breakdown in their dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements.

---

## 📄 License

This project is licensed under the MIT License.
