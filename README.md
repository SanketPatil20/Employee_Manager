# Leave & Productivity Analyzer

Live demo: https://employee-manager-steel.vercel.app/

A full-stack web application that analyzes employee attendance, leave usage, and productivity from uploaded Excel attendance sheets.

## Features

- Excel file upload (.xlsx) and parsing
- Attendance, leave and productivity calculations
- Interactive dashboard with monthly summaries and daily breakdowns
- Business rules: Mon–Fri 8.5h/day, Sat 4h/day, Sun off, 2 leaves/month

<img width="1597" height="854" alt="image" src=<img width="1892" height="912" alt="p1" src="https://github.com/user-attachments/assets/f99890d2-0273-482c-bcad-94af7bf97139"/>
<img width="1582" height="791" alt="image" src=<img width="1833" height="765" alt="p2" src="https://github.com/user-attachments/assets/49de1d31-6033-42fa-ae6e-e952b6616839" />
<img width="1592" height="847" alt="image" src= <img width="1808" height="702" alt="p3" src="https://github.com/user-attachments/assets/b2272bf0-797d-4d7e-bde3-ed18ee3b12c8" />
<img width="1592" height="847" alt="image" src= <img width="1765" height="771" alt="p4" src="https://github.com/user-attachments/assets/072dd757-f59f-4336-a8d6-430e442028fa" />
 />


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
