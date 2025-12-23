# Leave & Productivity Analyzer

Live demo: https://employee-management-omega-five.vercel.app/

A full-stack web application that analyzes employee attendance, leave usage, and productivity from uploaded Excel attendance sheets.

## Features

- Excel file upload (.xlsx) and parsing
- Attendance, leave and productivity calculations
- Interactive dashboard with monthly summaries and daily breakdowns
- Business rules: Mon–Fri 8.5h/day, Sat 4h/day, Sun off, 2 leaves/month

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Excel parsing: xlsx

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick installation & run

1. Clone the repository
   ```bash
   git clone https://github.com/SanketPatil20/Employee_Management.git
   cd Employee_Management
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with at minimum:
   ```env
   MONGODB_URI=mongodb://localhost:27017/employee_management
   PORT=5000
   ```
   (For MongoDB Atlas, replace MONGODB_URI with your connection string.)

4. Start the backend and frontend (development):
   - Start backend (in one terminal):
     ```bash
     npm run server
     # or for auto-reload
     npm run dev:server
     ```
   - Start frontend (in another terminal):
     ```bash
     npm run dev
     ```

5. Open the app in your browser:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

Optional:
- Create sample Excel data: `npm run create-sample` (creates `sample_attendance.xlsx`)

## Production build

1. Build frontend:
   ```bash
   npm run build
   ```
2. Start server:
   ```bash
   npm run server
   ```

## Excel file format (brief)

Expect columns: Employee Name | Date | In-Time | Out-Time. Date format YYYY-MM-DD or Excel date; time HH:MM (24-hour) or with AM/PM. Missing in/out on working days is treated as leave.


## Project structure (short)

Employee_Management/
├── backend/
├── src/ (frontend)
├── scripts/
├── server.js
├── package.json
└── README.md

## License

MIT

(Updated README to move the deployed link to the top and to simplify installation instructions.)
