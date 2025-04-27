# RIT Links In - Backend

This is the backend server for the RIT Links In skill-based student selection system.

## Requirements

- Python 3.8+
- Firebase Admin SDK
- Tesseract OCR

## Features

- User authentication and management
- Skill verification using OCR
- Project management for faculty
- Student skill ranking algorithm
- Applications handling

## Setup Instructions

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Install Tesseract OCR on your system:

```bash
# For Ubuntu/Debian
sudo apt-get install tesseract-ocr

# For macOS
brew install tesseract

# For Windows, download installer from: https://github.com/UB-Mannheim/tesseract/wiki
```

3. Create a `serviceAccountKey.json` file from your Firebase project:
   - Go to Firebase Console
   - Project Settings > Service Accounts
   - Generate new private key
   - Save as `serviceAccountKey.json` in the backend directory

4. Run the application:

```bash
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/register` - Register a new user

### Skills Management
- POST `/api/skills` - Add a new skill with certification verification

### Projects
- POST `/api/projects` - Add a new project (faculty only)
- POST `/api/projects/apply` - Apply for a project (student only)

### Student Search
- GET `/api/students/search?skill=<skill>&limit=<limit>` - Search students by skill