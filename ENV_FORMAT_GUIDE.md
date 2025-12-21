# .env File Format Guide

## Current Issue
Your `.env` file still has the default localhost connection. You need to replace it with your MongoDB Atlas connection string.

## Correct Format

Your `.env` file should look like this:

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority

# Server Port
PORT=5000
```

## Important Notes

1. **Replace the entire line** - Don't add a new line, replace the existing `MONGODB_URI=...` line
2. **No quotes needed** - Don't wrap the connection string in quotes
3. **Include database name** - Make sure `/employee_management` is in the connection string (before the `?`)
4. **URL encode special characters** - If your password has special characters like `@`, `#`, `%`, etc., they need to be URL encoded:
   - `@` becomes `%40`
   - `#` becomes `%23`
   - `%` becomes `%25`
   - `&` becomes `%26`

## Example

If your MongoDB Atlas connection string from the dashboard is:
```
mongodb+srv://myuser:mypass@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

You should update it to:
```env
MONGODB_URI=mongodb+srv://myuser:mypass@cluster0.abc123.mongodb.net/employee_management?retryWrites=true&w=majority
```

Notice:
- Added `/employee_management` before the `?`
- Removed the `/` before `?` (if it was there)

## Steps to Fix

1. Open `.env` file in your editor
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/employee_management`
3. Replace it with your MongoDB Atlas connection string
4. Save the file
5. Run `npm run test-db` to verify

