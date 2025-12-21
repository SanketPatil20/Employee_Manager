import xlsx from 'xlsx';
import fs from 'fs';

// Sample attendance data
const sampleData = [
  // January 2024 - John Doe
  { 'Employee Name': 'John Doe', 'Date': '2024-01-01', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-02', 'In-Time': '10:15', 'Out-Time': '18:45' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-03', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-04', 'In-Time': '', 'Out-Time': '' }, // Leave
  { 'Employee Name': 'John Doe', 'Date': '2024-01-05', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-06', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'John Doe', 'Date': '2024-01-08', 'In-Time': '10:00', 'Out-Time': '18:30' }, // Monday (skip Sunday)
  { 'Employee Name': 'John Doe', 'Date': '2024-01-09', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-10', 'In-Time': '', 'Out-Time': '' }, // Leave
  { 'Employee Name': 'John Doe', 'Date': '2024-01-11', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-12', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'John Doe', 'Date': '2024-01-15', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-16', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-17', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-18', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-19', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-20', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'John Doe', 'Date': '2024-01-22', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-23', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-24', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-25', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-26', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'John Doe', 'Date': '2024-01-29', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-30', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'John Doe', 'Date': '2024-01-31', 'In-Time': '10:00', 'Out-Time': '18:30' },
  
  // January 2024 - Jane Smith
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-01', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-02', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-03', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-04', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-05', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-06', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-08', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-09', 'In-Time': '', 'Out-Time': '' }, // Leave
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-10', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-11', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-12', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-15', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-16', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-17', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-18', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-19', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-20', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-22', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-23', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-24', 'In-Time': '', 'Out-Time': '' }, // Leave
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-25', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-26', 'In-Time': '10:00', 'Out-Time': '14:00' }, // Saturday
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-29', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-30', 'In-Time': '10:00', 'Out-Time': '18:30' },
  { 'Employee Name': 'Jane Smith', 'Date': '2024-01-31', 'In-Time': '10:00', 'Out-Time': '18:30' },
];

// Create workbook and worksheet
const worksheet = xlsx.utils.json_to_sheet(sampleData);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance');

// Write to file
const outputPath = './sample_attendance.xlsx';
xlsx.writeFile(workbook, outputPath);

console.log(`✅ Sample Excel file created: ${outputPath}`);
console.log(`📊 Contains ${sampleData.length} attendance records`);
console.log(`👥 Employees: John Doe, Jane Smith`);
console.log(`📅 Month: January 2024`);

