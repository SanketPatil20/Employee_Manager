# Leave & Productivity Analyzer

A full-stack web application that analyzes employee attendance, leave usage, and productivity based on uploaded Excel attendance sheets.

## Features

- 📤 **Excel File Upload** - Upload `.xlsx` files with employee attendance data
- 📊 **Attendance Analysis** - Automatically calculates worked hours, leaves, and productivity
- 📈 **Dashboard** - View monthly summaries with detailed daily breakdowns
- ⏰ **Business Rules**:
  - Monday to Friday: 8.5 hours/day (10:00 AM - 6:30 PM)
  - Saturday: 4 hours/day (10:00 AM - 2:00 PM)
  - Sunday: Off
  - 2 leaves allowed per month per employee

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (MongoDB Atlas compatible)
- **Excel Parsing**: xlsx library

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas account)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Employee_Management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/employee_management
   PORT=5000
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
   PORT=5000
   ```

4. **Create sample Excel file (optional)**
   ```bash
   npm run create-sample
   ```
   This creates `sample_attendance.xlsx` in the root directory.

## Running the Application

### Development Mode

1. **Start the backend server** (in one terminal):
   ```bash
   npm run server
   ```
   Or with auto-reload:
   ```bash
   npm run dev:server
   ```

2. **Start the frontend** (in another terminal):
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Build

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the server**:
   ```bash
   npm run server
   ```

## Excel File Format

The application expects Excel files (`.xlsx` or `.xls`) with the following columns:

| Employee Name | Date       | In-Time | Out-Time |
|---------------|------------|---------|----------|
| John Doe      | 2024-01-01 | 10:00   | 18:30    |
| John Doe      | 2024-01-02 | 10:15   | 18:45    |
| John Doe      | 2024-01-03 |         |          |

**Notes:**
- Column names are case-insensitive and can have variations (e.g., "Employee Name", "EmployeeName", "Employee")
- Date format: YYYY-MM-DD or Excel date format
- Time format: HH:MM (24-hour) or HH:MM AM/PM
- Missing In-Time/Out-Time on working days are treated as leaves

## API Endpoints

### Upload Excel File
```
POST /api/upload
Content-Type: multipart/form-data
Body: file (Excel file)
```

### Get Dashboard Data
```
GET /api/dashboard?employeeName={name}&year={year}&month={month}
```

### Get Employees List
```
GET /api/dashboard/employees
```

### Get Available Months
```
GET /api/dashboard/months/:employeeName
```

### Health Check
```
GET /api/health
```

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json`** (if not exists):
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

**Notes for this repo**:

- The backend is exported as a serverless handler using `serverless-http`, so Vercel will run `server.js` as serverless functions as configured in `vercel.json`.
- To add environment variables via the CLI (example):

```bash
vercel env add MONGODB_URI production
```

You can also set `MONGODB_URI` in the Vercel dashboard under Project Settings → Environment Variables.

## Live Demo

The app is deployed at: https://employee-management-omega-five.vercel.app/

## Screenshots

Below are example screenshots from the deployed app. To include these images in the README, add the image files to `docs/screenshots/` and use the example markdown below (the repository currently contains placeholders; I can add the actual image files if you provide them or allow me to upload them here):

```markdown
![Upload and Dashboard](docs/screenshots/dashboard_upload.png)

![Performance Analytics (Burnup + Distribution)](docs/screenshots/performance_analytics.png)

![Shift Frequency + Productivity Bullet](docs/screenshots/shift_productivity.png)

![Daily Attendance Breakdown](docs/screenshots/daily_breakdown.png)
```

Recommended filenames (place in `docs/screenshots/`):

- `dashboard_upload.png` — upload success and top-level dashboard cards
- `performance_analytics.png` — burnup and monthly distribution charts
- `shift_productivity.png` — shift frequency and productivity bullet graph
- `daily_breakdown.png` — collapsed daily attendance breakdown / badges

If you want, I can add these image files into the repo for you — either upload them here or tell me where the screenshots are, and I'll commit them into `docs/screenshots/` and update this README to show them inline.

4. **Set environment variables** in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string

### Netlify Deployment

1. **Create `netlify.toml`**:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/server/:splat"
     status = 200
   ```

2. **Deploy via Netlify CLI or dashboard**

## Project Structure

```
Employee_Management/
├── backend/
│   ├── models/
│   │   └── Attendance.js       # MongoDB schema
│   ├── routes/
│   │   ├── upload.js           # File upload endpoint
│   │   └── dashboard.js        # Dashboard data endpoints
│   └── utils/
│       ├── excelParser.js      # Excel parsing logic
│       └── calculations.js     # Business logic calculations
├── src/
│   ├── App.jsx                 # Main React component
│   ├── App.css                 # Styles
│   └── main.jsx                # React entry point
├── scripts/
│   └── createSampleExcel.js    # Sample Excel generator
├── server.js                   # Express server
├── package.json
└── README.md
```

## Business Logic

### Working Hours Calculation
- **Monday-Friday**: 8.5 hours (10:00 AM - 6:30 PM)
- **Saturday**: 4 hours (10:00 AM - 2:00 PM)
- **Sunday**: 0 hours (off day)

### Leave Detection
- Missing attendance on working days (Monday-Saturday) is marked as leave
- Each employee is allowed 2 leaves per month

### Productivity Calculation
```
Productivity = (Actual Worked Hours / Expected Working Hours) × 100
```

Expected hours are calculated based on the number of working days in the selected month.

## Sample Data

Run `npm run create-sample` to generate a sample Excel file with:
- 2 employees (John Doe, Jane Smith)
- January 2024 attendance data
- Mix of present days, leaves, and weekends

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local MongoDB)
- Check MongoDB Atlas connection string format
- Verify network access in MongoDB Atlas (whitelist IP addresses)

### Excel Parsing Errors
- Ensure file is `.xlsx` or `.xls` format
- Check column names match expected format
- Verify date and time formats are correct

### CORS Issues
- Backend CORS is configured to allow all origins in development
- For production, update CORS settings in `server.js`

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
