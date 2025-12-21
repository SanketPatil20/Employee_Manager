# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you already have one)

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free tier) - perfect for development
3. Select a cloud provider and region (choose closest to you)
4. Click **"Create"** and wait for the cluster to be created (2-3 minutes)

## Step 3: Create Database User

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication method
4. Enter a username and password (save these!)
5. Set user privileges to **"Atlas admin"** or **"Read and write to any database"**
6. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Add Current IP Address"**
4. Or click **"Allow Access from Anywhere"** (0.0.0.0/0) - less secure but easier for testing
5. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Node.js"** and version **"5.5 or later"**
5. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update .env File

1. Open the `.env` file in your project root
2. Replace the connection string with your MongoDB Atlas connection string
3. Replace `<username>` and `<password>` with your database user credentials
4. Add a database name at the end (before `?`), like:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/employee_management?retryWrites=true&w=majority
   ```

**Example:**
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/employee_management?retryWrites=true&w=majority
PORT=5000
```

## Step 7: Test Connection

Run the test script to verify your connection:

```bash
npm run test-db
```

You should see:
```
✅ Successfully connected to MongoDB!
📊 Database: employee_management
🌐 Host: cluster0.xxxxx.mongodb.net
✅ Database ping successful!
🎉 MongoDB Atlas connection is working correctly!
```

## Troubleshooting

### Connection Timeout
- Check if your IP address is whitelisted in MongoDB Atlas Network Access
- Try "Allow Access from Anywhere" (0.0.0.0/0) temporarily for testing

### Authentication Failed
- Verify your username and password are correct
- Make sure there are no special characters that need URL encoding in your password
- If password has special characters, URL encode them (e.g., `@` becomes `%40`)

### Connection String Format
- Make sure the connection string includes the database name
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`

## For Vercel Deployment

When deploying to Vercel, add the `MONGODB_URI` environment variable in Vercel dashboard:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `MONGODB_URI` with your MongoDB Atlas connection string
4. Make sure to whitelist Vercel's IP addresses or use 0.0.0.0/0 for production

