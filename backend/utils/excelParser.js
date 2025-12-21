import xlsx from 'xlsx';
import { calculateWorkedHours, getExpectedHours, isWorkingDay } from './calculations.js';

/**
 * Parse Excel file and extract attendance data
 * Expected columns: Employee Name, Date, In-Time, Out-Time
 */
export function parseExcelFile(buffer) {
  const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON with date handling
  const data = xlsx.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
  
  const attendanceRecords = [];
  const errors = [];
  
  data.forEach((row, index) => {
    try {
      // Normalize column names (handle variations)
      const employeeName = row['Employee Name'] || row['EmployeeName'] || row['Employee'] || row['Name'];
      const dateStr = row['Date'] || row['date'];
      const inTime = row['In-Time'] || row['InTime'] || row['In Time'] || row['In'];
      const outTime = row['Out-Time'] || row['OutTime'] || row['Out Time'] || row['Out'];
      
      if (!employeeName) {
        errors.push(`Row ${index + 2}: Missing Employee Name`);
        return;
      }
      
      if (!dateStr) {
        errors.push(`Row ${index + 2}: Missing Date`);
        return;
      }
      
      // Parse date
      let date;
      if (dateStr instanceof Date) {
        date = new Date(dateStr);
      } else if (typeof dateStr === 'number') {
        // Excel date serial number
        date = xlsx.SSF.parse_date_code(dateStr);
        if (date) {
          date = new Date(date.y, date.m - 1, date.d);
        } else {
          errors.push(`Row ${index + 2}: Invalid date serial number: ${dateStr}`);
          return;
        }
      } else if (typeof dateStr === 'string') {
        // Handle various date formats
        // Try parsing as ISO date first
        date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          // Try other formats (DD/MM/YYYY, MM/DD/YYYY, etc.)
          const dateParts = dateStr.split(/[-\/]/);
          if (dateParts.length === 3) {
            // Try YYYY-MM-DD format
            if (dateParts[0].length === 4) {
              date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            } else {
              // Try DD/MM/YYYY or MM/DD/YYYY
              date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            }
          }
          
          if (isNaN(date.getTime())) {
            errors.push(`Row ${index + 2}: Invalid date format: ${dateStr}`);
            return;
          }
        }
      } else {
        errors.push(`Row ${index + 2}: Invalid date format`);
        return;
      }
      
      // Normalize date to start of day
      date.setHours(0, 0, 0, 0);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      
      // Check if it's a working day
      const isWorking = isWorkingDay(date);
      const expectedHours = getExpectedHours(date);
      
      // Determine if it's a leave (missing attendance on working day)
      const isLeave = isWorking && (!inTime || !outTime);
      
      // Calculate worked hours if both in-time and out-time are present
      let workedHours = 0;
      if (inTime && outTime && isWorking) {
        workedHours = calculateWorkedHours(inTime, outTime, date);
      }
      
      attendanceRecords.push({
        employeeName: String(employeeName).trim(),
        date,
        inTime: inTime ? String(inTime).trim() : null,
        outTime: outTime ? String(outTime).trim() : null,
        workedHours,
        isLeave,
        dayOfWeek,
        expectedHours,
        month,
        year
      });
      
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error.message}`);
    }
  });
  
  return {
    records: attendanceRecords,
    errors
  };
}

