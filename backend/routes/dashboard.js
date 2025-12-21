import express from 'express';
import Attendance from '../models/Attendance.js';
import { getExpectedHoursForMonth, calculateProductivity } from '../utils/calculations.js';

const router = express.Router();

/**
 * Get dashboard data for a specific employee and month
 * Query params: employeeName, year, month
 */
router.get('/', async (req, res) => {
  try {
    const { employeeName, year, month } = req.query;
    
    if (!employeeName || !year || !month) {
      return res.status(400).json({ 
        error: 'Missing required parameters: employeeName, year, month' 
      });
    }
    
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ 
        error: 'Invalid year or month' 
      });
    }
    
    // Get all attendance records for the employee in the specified month
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59);
    
    const records = await Attendance.find({
      employeeName,
      year: yearNum,
      month: monthNum
    }).sort({ date: 1 });
    
    // Calculate totals
    const totalActualHours = records.reduce((sum, record) => sum + record.workedHours, 0);
    const totalExpectedHours = getExpectedHoursForMonth(yearNum, monthNum);
    const leavesUsed = records.filter(r => r.isLeave).length;
    const productivity = calculateProductivity(totalActualHours, totalExpectedHours);
    
    // Daily breakdown
    const dailyBreakdown = records.map(record => ({
      date: record.date,
      dayOfWeek: record.dayOfWeek,
      inTime: record.inTime,
      outTime: record.outTime,
      workedHours: record.workedHours,
      expectedHours: record.expectedHours,
      isLeave: record.isLeave
    }));
    
    res.json({
      employeeName,
      year: yearNum,
      month: monthNum,
      totalExpectedHours: parseFloat(totalExpectedHours.toFixed(2)),
      totalActualHours: parseFloat(totalActualHours.toFixed(2)),
      leavesUsed,
      leavesAllowed: 2,
      productivity: parseFloat(productivity.toFixed(2)),
      dailyBreakdown
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      message: error.message 
    });
  }
});

/**
 * Get list of employees
 */
router.get('/employees', async (req, res) => {
  try {
    const employees = await Attendance.distinct('employeeName');
    res.json({ employees });
  } catch (error) {
    console.error('Employees list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch employees',
      message: error.message 
    });
  }
});

/**
 * Get available months for an employee
 */
router.get('/months/:employeeName', async (req, res) => {
  try {
    const { employeeName } = req.params;
    
    const months = await Attendance.distinct('month', { employeeName });
    const years = await Attendance.distinct('year', { employeeName });
    
    // Get unique year-month combinations
    const monthYearCombos = [];
    for (const year of years) {
      for (const month of months) {
        const count = await Attendance.countDocuments({ employeeName, year, month });
        if (count > 0) {
          monthYearCombos.push({ year, month, recordCount: count });
        }
      }
    }
    
    res.json({ monthYearCombos });
  } catch (error) {
    console.error('Months list error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch months',
      message: error.message 
    });
  }
});

export default router;

