# Deployment Guide

This guide walks through connecting MongoDB Atlas, Render, and Vercel for this project.

## 1. Create Your MongoDB Database

Use MongoDB Atlas for production storage.

1. Go to MongoDB Atlas and create an account or sign in.
2. Create a new project.
3. Create a cluster.
4. Open `Database Access`.
5. Create a database user with a username and password.
6. Open `Network Access`.
7. Add an IP access rule.
8. For the simplest setup, allow `0.0.0.0/0`.
9. Open your cluster and click `Connect`.
10. Choose `Drivers`.
11. Copy the MongoDB connection string.

It will look similar to:

```env
mongodb+srv://USERNAME:PASSWORD@cluster-name.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Replace `USERNAME` and `PASSWORD` with your actual database credentials.

## 2. Backend Environment Variables

The backend uses environment variables for MongoDB and server settings.

Create a local `backend/.env` file if you want to run the backend locally:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
DEFAULT_ADMIN_EMAIL=admin@mepc.com
DEFAULT_ADMIN_PASSWORD=admin123
```

Notes:

- `MONGO_URI` must be your real Atlas connection string.
- Replace the password placeholder with the actual MongoDB user password.
- Do not commit `.env` to version control.

## 3. Deploy the Backend to Render

Open Render and configure the backend service.

### Render service settings

Use these values:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

### Render environment variables

In your Render backend service, open `Environment` and add:

- `MONGO_URI`
- `PORT`
- `DEFAULT_ADMIN_EMAIL`
- `DEFAULT_ADMIN_PASSWORD`

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
DEFAULT_ADMIN_EMAIL=admin@mepc.com
DEFAULT_ADMIN_PASSWORD=admin123
```

After saving the variables, deploy the backend.

## 4. Verify the Backend on Render

After deployment finishes:

1. Open the Render logs.
2. Confirm you see a successful MongoDB connection message.
3. Confirm the server starts successfully.

You should expect logs similar to:

```txt
MongoDB connected
Server listening on port 5000
```

Then test the live backend URL in your browser or Postman:

```txt
https://your-render-backend.onrender.com/api/resolutions
https://your-render-backend.onrender.com/api/pending-resolutions
```

If the setup is correct, these endpoints should return JSON.

## 5. Connect the Frontend on Vercel

The frontend must point to the deployed Render backend.

Open Vercel and go to your frontend project.

Add this environment variable in `Settings` -> `Environment Variables`:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

Important:

- Use your actual Render backend URL.
- Do not use `localhost` in production.

## 6. Redeploy the Frontend on Vercel

After adding `VITE_API_BASE_URL`:

1. Trigger a redeploy in Vercel.
2. Wait for the build to finish.
3. Open the deployed frontend URL.

Vite frontend environment variables only apply after a new build, so redeploying is required.

## 7. Test the Full Production Flow

After both deployments are live:

1. Open the Vercel frontend.
2. Submit a new pending resolution.
3. Open the admin dashboard.
4. Approve the pending resolution.
5. Refresh the site.
6. Confirm the resolution still exists.

If the data remains after refresh or redeploy, MongoDB persistence is working correctly.

## 8. What Connects to What

- MongoDB Atlas stores the permanent resolution data.
- Render runs the Node.js and Express backend.
- The Render backend connects to Atlas using `MONGO_URI`.
- Vercel runs the frontend.
- The Vercel frontend connects to Render using `VITE_API_BASE_URL`.

## 9. Production Checklist

Before going live, confirm all of the following:

- `.env` is not committed
- `MONGO_URI` is set in Render
- `VITE_API_BASE_URL` is set in Vercel
- Atlas allows inbound connections from Render
- Render is using the `backend` directory
- Render is running `npm start`
- The frontend is calling the Render backend, not `localhost`

## 10. Quick Reference

### MongoDB Atlas

- Create cluster
- Create DB user
- Allow network access
- Copy connection string

### Render

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGO_URI`

### Vercel

- Add `VITE_API_BASE_URL`
- Redeploy frontend

## 11. Example Final Setup

### Render env

```env
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/mepc?retryWrites=true&w=majority
PORT=5000
DEFAULT_ADMIN_EMAIL=admin@mepc.com
DEFAULT_ADMIN_PASSWORD=admin123
```

### Vercel env

```env
VITE_API_BASE_URL=https://mepc-backend.onrender.com
```
