import fetch from 'node-fetch';

const url = 'http://127.0.0.1:5000/api/dashboard?employeeName=John%20Doe&year=2024&month=1';

(async () => {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Status:', res.status);
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Request failed:', err.message);
    }
})();
