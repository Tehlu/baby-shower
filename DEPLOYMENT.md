# Deployment Guide for Baby Shower Upload App

## Prerequisites

1. **Google Drive API Setup**
   - Service Account JSON key file
   - Google Drive folder ID where files will be uploaded
   - Proper permissions set on the folder

2. **Render Account**
   - Free or paid Render account
   - GitHub repository connected

## Environment Variables

### Backend Environment Variables (Set in Render Dashboard)

```bash
NODE_ENV=production
GOOGLE_DRIVE_FOLDER_ID=your_google_drive_folder_id_here
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
PORT=10000
```

### Frontend Environment Variables (Set in Render Dashboard)

```bash
VITE_API_URL=https://babyshower-upload-backend.onrender.com
```

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure your service account key is in environment variables (not in the repo)
2. Remove any hardcoded localhost URLs
3. Test locally with environment variables

### 2. Deploy Backend First

1. Go to Render Dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `babyshower-upload-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid if you want always-on)

5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `GOOGLE_DRIVE_FOLDER_ID`: Your Google Drive folder ID
   - `GOOGLE_SERVICE_ACCOUNT_KEY`: Full JSON content of your service account key
   - `PORT`: `10000`

6. Deploy and test the `/test` endpoint

### 3. Deploy Frontend

1. Go to Render Dashboard
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `babyshower-upload-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

5. Add Environment Variables:
   - `VITE_API_URL`: `https://babyshower-upload-backend.onrender.com`

6. Deploy and test the upload functionality

## Testing Your Deployment

1. **Backend Test**: Visit `https://babyshower-upload-backend.onrender.com/test`
2. **Frontend Test**: Visit your frontend URL and try uploading a file
3. **Check Google Drive**: Verify files are being uploaded to your folder

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the frontend URL is in the allowed origins
2. **Google Drive Authentication**: Verify service account key is correct
3. **Build Failures**: Check that all dependencies are in package.json
4. **Environment Variables**: Ensure all required variables are set in Render

### Debugging

1. Check Render logs for error messages
2. Use the `/test` endpoint to verify backend configuration
3. Check browser console for frontend errors
4. Verify Google Drive folder permissions

## Security Notes

- ✅ Service account key is in environment variables
- ✅ CORS is properly configured for production
- ✅ File size and type validation is in place
- ✅ HTTPS is automatically provided by Render

## Cost Considerations

- **Free Tier**: 750 hours/month (enough for personal projects)
- **Paid Tier**: $7/month for always-on service
- **Bandwidth**: 100GB/month free, then $0.10/GB

## Custom Domain (Optional)

1. Purchase a domain
2. Add it to your Render service
3. Update CORS configuration to include your domain
4. Update DNS settings as instructed by Render 