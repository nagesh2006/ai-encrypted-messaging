# AI Encrypted Messaging - Frontend

A modern, secure messaging interface built with Next.js 14, TypeScript, and TailwindCSS.

## Features

- 🔐 Secure authentication with OTP verification
- 💬 Real-time messaging with WebSocket support
- 🎨 Modern gradient UI with status indicators
- 📱 Responsive design for all devices
- 🛡️ Message status visualization (Allowed/Flagged/Blocked)

## Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

## Components

- **AuthForm**: Login/Register with OTP verification
- **ChatInterface**: Main messaging interface with sidebar and chat area
- **API utilities**: Backend communication helpers

## Message Status System

- 🟢 **Green**: Safe messages (allowed)
- 🟡 **Yellow**: Flagged messages (potentially problematic)
- 🔴 **Red**: Blocked messages (harmful content)

The application automatically connects to the backend API and provides real-time messaging capabilities with AI-powered content filtering.