# Baby Shower Memory Upload Website

A beautiful, responsive website for collecting photo and video memories for an upcoming baby shower. Built with React, Node.js, and Google Drive integration.

## Features

- Mobile-first, responsive design with a magical garden theme
- Direct file upload to Google Drive
- Support for both photos and videos
- Beautiful UI with custom animations and transitions

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account with Drive API enabled

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Create a `.env` file in the server directory with the following variables:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
PORT=3001
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Start the server:
```bash
npm start
```

### Google Drive API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google Drive API
4. Create OAuth 2.0 credentials
5. Set up the OAuth consent screen
6. Generate a refresh token using the OAuth 2.0 Playground
7. Create a folder in Google Drive and copy its ID

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3001`

## Technologies Used

- React with TypeScript
- Vite
- Tailwind CSS
- Node.js with Express
- Google Drive API
- Multer for file handling
