import FormData from 'form-data';
import fs from 'fs';
import fetch from 'node-fetch';

const filePath = './sample_attendance.xlsx';

if (!fs.existsSync(filePath)) {
  console.error('❌ Sample file not found:', filePath);
  process.exit(1);
}

const formData = new FormData();
formData.append('file', fs.createReadStream(filePath));

console.log('📤 Uploading sample Excel file...');

try {
  const response = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('✅ Upload successful!');
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.error('❌ Upload failed!');
    console.error('Status:', response.status);
    console.error('Error:', JSON.stringify(data, null, 2));
  }
} catch (error) {
  console.error('❌ Request failed:', error.message);
}

