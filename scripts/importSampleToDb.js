import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../backend/models/Attendance.js';
import { parseExcelFile } from '../backend/utils/excelParser.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management';

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for import');

        const buffer = fs.readFileSync('./sample_attendance.xlsx');
        const { records, errors } = parseExcelFile(buffer);
        console.log(`Parsed ${records.length} records, ${errors.length} errors`);

        if (records.length === 0) {
            console.error('No records to import');
            process.exit(1);
        }

        const bulkOps = records.map(record => ({
            updateOne: {
                filter: { employeeName: record.employeeName, date: record.date },
                update: { $set: record },
                upsert: true
            }
        }));

        const result = await Attendance.bulkWrite(bulkOps);
        console.log('Bulk write result:', result.nUpserted || result);

        await mongoose.disconnect();
        console.log('Import complete');
    } catch (err) {
        console.error('Import failed:', err);
        process.exit(1);
    }
}

run();
