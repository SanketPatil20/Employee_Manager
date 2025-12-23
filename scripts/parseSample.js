import fs from 'fs';
import { parseExcelFile } from '../backend/utils/excelParser.js';

const path = './sample_attendance.xlsx';

(async () => {
    try {
        const buffer = fs.readFileSync(path);
        const result = parseExcelFile(buffer);
        console.log('Parsed records:', result.records.length);
        console.log(result.records.slice(0, 10));
        if (result.errors && result.errors.length) {
            console.error('Errors:', result.errors);
        }
    } catch (err) {
        console.error('Failed to parse sample:', err);
    }
})();
