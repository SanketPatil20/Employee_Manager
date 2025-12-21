import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  inTime: {
    type: String, // Store as string "HH:MM" format
    default: null
  },
  outTime: {
    type: String, // Store as string "HH:MM" format
    default: null
  },
  workedHours: {
    type: Number, // Store in decimal hours (e.g., 8.5)
    default: 0
  },
  isLeave: {
    type: Boolean,
    default: false
  },
  dayOfWeek: {
    type: String, // "Monday", "Tuesday", etc.
    required: true
  },
  expectedHours: {
    type: Number, // Expected working hours for this day
    required: true
  },
  month: {
    type: Number, // 1-12
    required: true,
    index: true
  },
  year: {
    type: Number, // e.g., 2024
    required: true,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ employeeName: 1, year: 1, month: 1 });
attendanceSchema.index({ employeeName: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;

