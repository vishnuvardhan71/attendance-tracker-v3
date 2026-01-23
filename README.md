# 📊 Pro Attendance Tracker

A full-stack (MERN) web application designed for college students to track their attendance effortlessly, monitor their eligibility for exams (75% threshold), and manage their class schedules.

![Attendance Tracker Flow](https://img.shields.io/badge/Status-Complete-success)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)

## 🚀 Features

### 🔐 Multi-Step Onboarding
- **Smart Signup**: New users are guided through an initial configuration flow.
- **Initial Attendance Offset**: Start tracking even if you've already attended classes this semester by entering your current percentage.
- **Flexible Setup**: Configure your college timings, subjects, and weekly timetable in a few clicks.

### 📈 Intelligent Dashboards
- **Simple Dashboard**: A focused view showing only your overall progress and the attendance marker.
- **Full Dashboard**: Comprehensive subject-wise breakdown with progress bars.
- **Target Predictor**: Automatically calculates exactly how many more classes you need to attend consecutively to reach the 75% goal.
- **Color Coding**: Instant visual feedback—green for safe (≥75%) and red for critical (<75%).

### 📅 Advanced Tracking
- **Daily Attendance Marker**: One-click attendance marking based on your custom timetable.
- **Holiday Mode**: Mark days as holidays to stop them from affecting your percentage.
- **Persistent Storage**: All your data is securely stored in a MongoDB database.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JWT (JSON Web Tokens), bcryptjs.
- **Deployment**: GitHub Pages (Client), GitHub Actions.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/vishnuvardhan71/attendance-tracker-v3.git
cd attendance-tracker-v3
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the client:
```bash
npm run dev
```

## 📜 License
Internal Project - All rights reserved.
