# Backend Deployment Guide for Render

## Prerequisites

1. MongoDB Database (MongoDB Atlas or Render MongoDB)
2. GitHub repository connected to Render

## Step-by-Step Deployment

### 1. Create MongoDB Database

**Option A: MongoDB Atlas (Recommended - FREE)**

1. **Sign up/Login**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (choose closest to Render's region)
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access" in the left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: Create a username (e.g., `mernuser`)
   - Password: Generate a secure password (SAVE THIS!)
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Addresses**:
   - Go to "Network Access" in the left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (adds `0.0.0.0/0`)
   - Click "Confirm"
   - ⚠️ **Important**: This allows connections from anywhere. For production, restrict to Render's IPs.

5. **Get Connection String**:
   - Go to "Database" in the left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `mernform`)
   - Example: `mongodb+srv://mernuser:YourPassword123@cluster0.xxxxx.mongodb.net/mernform?retryWrites=true&w=majority`

**Option B: Render MongoDB**
1. In Render dashboard, click "New +" → "MongoDB"
2. Choose a name and plan (Free tier available)
3. Render will automatically provide the connection string in the service dashboard
4. Copy the "Internal Database URL" or "External Database URL"

### 2. Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `sanjanapippari/mern1`
4. Configure the service:
   - **Name**: `mern1-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `22.16.0` (or latest LTS)

### 3. Environment Variables

Add these environment variables in Render dashboard:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `5000` | Server port (Render sets this automatically, but you can specify) |
| `MONGO_URI` | `your-mongodb-connection-string` | MongoDB connection string from Atlas or Render |

**To add environment variables:**
1. Go to your Render service dashboard
2. Click on **"Environment"** tab (in the left sidebar)
3. Click **"Add Environment Variable"**
4. Add `MONGO_URI`:
   - **Key**: `MONGO_URI`
   - **Value**: Paste your MongoDB connection string
   - Example: `mongodb+srv://mernuser:YourPassword123@cluster0.xxxxx.mongodb.net/mernform?retryWrites=true&w=majority`
5. Click **"Save Changes"**
6. Render will automatically redeploy your service

⚠️ **Important**: After adding `MONGO_URI`, your service will automatically redeploy. Check the logs to verify the connection.

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start your server (`npm start`)

### 5. Verify Deployment

Once deployed, you should see:
- ✅ Service is "Live"
- ✅ Health check endpoint: `https://your-backend.onrender.com/`
- ✅ API endpoints available at: `https://your-backend.onrender.com/api/form`

## Backend Structure

```
backend/
├── src/
│   ├── server.js          # Main server file
│   ├── routes/
│   │   └── formRoutes.js  # API routes
│   ├── controllers/
│   │   └── formController.js  # Business logic
│   └── models/
│       └── Form.js        # MongoDB schema
├── package.json           # Dependencies and scripts
└── nodemon.json          # Development config
```

## API Endpoints

After deployment, your API will be available at:

- `GET https://your-backend.onrender.com/` - Health check
- `GET https://your-backend.onrender.com/api/form` - Get all forms
- `POST https://your-backend.onrender.com/api/form` - Create form
- `GET https://your-backend.onrender.com/api/form/:id` - Get form by ID
- `PUT https://your-backend.onrender.com/api/form/:id` - Update form
- `DELETE https://your-backend.onrender.com/api/form/:id` - Delete form

## Troubleshooting

### Issue: "MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017"

This error means your app is trying to connect to local MongoDB instead of your cloud database.

**Fix Steps:**
1. ✅ Go to Render dashboard → Your service → **Environment** tab
2. ✅ Check if `MONGO_URI` environment variable exists
3. ✅ If missing, click **"Add Environment Variable"**:
   - **Key**: `MONGO_URI`
   - **Value**: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mernform?retryWrites=true&w=majority`
4. ✅ Click **"Save Changes"** (service will auto-redeploy)
5. ✅ Check logs after redeploy - you should see "✅ MongoDB Connected Successfully"

**Common Mistakes:**
- ❌ Forgetting to replace `<password>` in connection string
- ❌ Using wrong database name
- ❌ Not whitelisting IP addresses in MongoDB Atlas
- ❌ Typo in environment variable name (must be exactly `MONGO_URI`)

### Issue: "Port already in use"
- ✅ Render automatically sets `PORT` environment variable
- ✅ Your `server.js` already uses `process.env.PORT || 5000` ✅

### Issue: "Module not found"
- ✅ Ensure all dependencies are in `package.json`
- ✅ Check build logs for installation errors

### Issue: Service keeps restarting
- ✅ Check logs for errors
- ✅ Verify MongoDB connection is working
- ✅ Ensure start command is correct: `npm start`

## Updating Frontend to Use Backend URL

After backend is deployed, update your frontend to use the backend URL:

1. In frontend code, replace `http://localhost:5000` with your Render backend URL
2. Example: `https://mern1-backend.onrender.com`

## Using render.yaml (Alternative)

If you prefer using `render.yaml`:
1. The `render.yaml` file is already configured in the root
2. Render will automatically detect and use it
3. Make sure to set `MONGO_URI` in Render dashboard (sync: false means you set it manually)

## Notes

- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for always-on service
- Backend URL will be: `https://your-service-name.onrender.com`

