# Render Deployment Configuration

## For Frontend (Static Site) Deployment on Render:

### Option 1: Using Render Dashboard (Recommended)

1. Go to your Render dashboard
2. Select your static site service
3. Update the following settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Option 2: Using render.yaml

The `render.yaml` file in the root directory is configured for both frontend and backend services.

## Important Notes:

- Make sure **Root Directory** is set to `frontend` for the frontend service
- The **Build Command** must include `npm install` to install dependencies before building
- The **Publish Directory** should be set to `build` (the output of `npm run build`)

## Current Issue Fix:

If you're getting `react-scripts: not found` error, it means dependencies aren't being installed. Update your Build Command in Render dashboard to:

```
npm install && npm run build
```

This ensures dependencies are installed before the build runs.

