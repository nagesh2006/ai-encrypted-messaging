# AI Encrypted Messaging - Setup Guide

## Quick Fix for "Failed to Fetch" Error

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
Create `.env` file in backend folder:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Database Schema
Run the SQL from `database/schema.sql` in your Supabase SQL Editor.

### 4. Start Backend
```bash
cd backend
python main.py
```
Backend should run on http://localhost:8000

### 5. Test Backend
```bash
python test_backend.py
```

### 6. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend should run on http://localhost:3000

## New Features Added

✅ **Username Support**
- Users now register with email + username + password
- Message someone by their username (not user ID)
- Username validation (lowercase, alphanumeric + underscore only)

✅ **Fixed CORS Issues**
- Backend now allows all origins during development
- Proper error handling for API calls

✅ **Better User Experience**
- Clear error messages
- Username display in UI
- Improved chat partner selection

## Testing Registration

1. Go to http://localhost:3000
2. Click "Don't have an account? Sign up"
3. Enter email, username, and password
4. Check console for OTP code
5. Enter OTP to verify account
6. Login with email and password

## Starting a Chat

1. After login, click "New Chat"
2. Enter the username (not user ID) of who you want to message
3. Start chatting!

## Troubleshooting

- **"Failed to fetch"**: Make sure backend is running on port 8000
- **"User not found"**: Make sure the username exists and is verified
- **Database errors**: Check Supabase connection and schema