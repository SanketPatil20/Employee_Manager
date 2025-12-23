import express from 'express';
import multer from 'multer';
import Attendance from '../models/Attendance.js';
import { parseExcelFile } from '../utils/excelParser.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.endsWith('.xlsx') ||
      file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Upload and process Excel file
router.post('/', upload.single('file'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📤 File received:', req.file.originalname, 'Size:', req.file.size, 'bytes');

    // Parse Excel file
    let records, errors;
    try {
      const result = parseExcelFile(req.file.buffer);
      records = result.records;
      errors = result.errors;
    } catch (parseError) {
      console.error('Excel parsing error:', parseError);
      return res.status(400).json({
        error: 'Failed to parse Excel file',
        message: parseError.message,
        details: parseError.stack
      });
    }

    if (records.length === 0) {
      return res.status(400).json({
        error: 'No valid records found in Excel file',
        errors: errors.length > 0 ? errors : ['Please check your Excel file format. Expected columns: Employee Name, Date, In-Time, Out-Time']
      });
    }

    console.log(`📊 Parsed ${records.length} records, ${errors.length} errors`);

    // Store records in database
    // Use bulk write with upsert to handle duplicates
    const bulkOps = records.map(record => ({
      updateOne: {
        filter: {
          employeeName: record.employeeName,
          date: record.date
        },
        update: {
          $set: record
        },
        upsert: true
      }
    }));

    try {
      await Attendance.bulkWrite(bulkOps);
      console.log('✅ Successfully saved records to database');
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Check if it's a connection error
      if (dbError.name === 'MongoServerError' || dbError.message.includes('connection')) {
        return res.status(500).json({
          error: 'Database connection failed',
          message: 'Please check your MongoDB connection. Make sure your MongoDB Atlas connection string is correct in .env file.',
          details: dbError.message
        });
      }
      throw dbError;
    }

    // Get unique employees and months from uploaded data
    const employees = [...new Set(records.map(r => r.employeeName))];
    const months = [...new Set(records.map(r => ({ year: r.year, month: r.month })))];

    res.json({
      success: true,
      message: `Successfully processed ${records.length} attendance records`,
      recordsProcessed: records.length,
      employees: employees.length,
      months,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to process file',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;

