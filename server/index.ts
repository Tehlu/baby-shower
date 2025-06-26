import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const app = express();

console.log('Environment check:', {
  hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for production and development
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://babyshower-upload-frontend.onrender.com',
      'https://babyshower-upload-backend.onrender.com',
      'https://*.onrender.com', // Allow any Render subdomain
      process.env.FRONTEND_URL // Allow custom domain if set
    ].filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File filter check:', file.mimetype);
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Google Drive API setup using Service Account from environment variable
let drive: ReturnType<typeof google.drive> | null = null;
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey && process.env.GOOGLE_DRIVE_FOLDER_ID) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountKey),
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    drive = google.drive({ version: 'v3', auth });
    console.log('Google Drive service account authentication configured.');
  } catch (error) {
    console.error('Failed to parse service account key:', error);
  }
} else {
  console.log('Missing service account key or folder ID. File uploads will not work.');
}

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasServiceAccountKey: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      hasFolderId: !!process.env.GOOGLE_DRIVE_FOLDER_ID,
      driveConfigured: !!drive,
      allowedOrigins
    }
  });
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Upload request received');
  try {
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!drive) {
      return res.status(500).json({ error: 'Google Drive not configured. Service account key or folder ID missing.' });
    }
    if (!process.env.GOOGLE_DRIVE_FOLDER_ID) {
      return res.status(500).json({ error: 'Google Drive folder ID not set in environment variables.' });
    }
    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    const fileMetadata = {
      name: `${Date.now()}-${req.file.originalname}`,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };
    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };
    console.log('Attempting to upload to Google Drive...');
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('Upload successful:', response.data.id);
    res.json({ 
      success: true, 
      fileId: response.data.id 
    });
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      status: error.status
    });
    let errorMessage = 'Failed to upload file';
    if (error.code === 401) {
      errorMessage = 'Google Drive authentication failed. Please check your service account.';
    } else if (error.code === 403) {
      errorMessage = 'Access denied to Google Drive folder. Please check folder permissions.';
    } else if (error.code === 404) {
      errorMessage = 'Google Drive folder not found. Please check the folder ID.';
    }
    res.status(500).json({ 
      error: errorMessage,
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:', {
    port: PORT,
    nodeEnv: process.env.NODE_ENV,
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ? 'Set' : 'Missing',
    serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Missing',
    allowedOrigins
  });
});
