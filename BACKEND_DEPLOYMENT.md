# Backend Deployment Guide for Render

## Prerequisites

1. MongoDB Database (MongoDB Atlas or Render MongoDB)
2. GitHub repository connected to Render

## Step-by-Step Deployment

### 1. Create MongoDB Database

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (add `0.0.0.0/0` for Render)
5. Get your connection string (MONGO_URI)

**Option B: Render MongoDB**
1. In Render dashboard, create a new MongoDB service
2. Render will provide the connection string automatically

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
1. Go to your service → **Environment** tab
2. Click **"Add Environment Variable"**
3. Add `MONGO_URI` with your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/mernform?retryWrites=true&w=majority`

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

### Issue: "MongoDB Connection Error"
- ✅ Check `MONGO_URI` environment variable is set correctly
- ✅ Verify MongoDB IP whitelist includes Render's IPs (or `0.0.0.0/0`)
- ✅ Check MongoDB username and password are correct

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

