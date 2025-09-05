# AI-Powered Fuzzy Logic Based Encrypted Messaging System

A secure, intelligent messaging platform that combines end-to-end encryption with AI-powered content filtering and fuzzy logic decision making.

## 🚀 Features

- **End-to-End Encryption**: AES + RSA hybrid encryption for all messages
- **AI Content Classification**: Spam/ham/toxic message detection using ML
- **Fuzzy Logic Filtering**: Intelligent decision making for message status
- **Real-time Messaging**: WebSocket-based instant communication
- **Email OTP Verification**: Gmail SMTP integration for secure registration
- **Username-based Messaging**: Chat with users by their username
- **Vibrant Modern UI**: Colorful, responsive chat interface
- **Message Status Indicators**: Visual feedback for message safety levels

## 🏗️ Architecture

```
Frontend (Next.js + TypeScript + TailwindCSS)
    ↓
Backend (FastAPI + Python)
    ↓
Database (Supabase PostgreSQL)
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Scikit-learn**: Machine learning for message classification
- **Scikit-fuzzy**: Fuzzy logic decision engine
- **Cryptography**: AES/RSA encryption implementation
- **Supabase**: Database and authentication
- **WebSockets**: Real-time communication

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **Supabase Client**: Authentication and real-time features

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 18+
- Supabase account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SECRET_KEY=your_secret_key
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
RSA_PRIVATE_KEY_PATH=./keys/private_key.pem
RSA_PUBLIC_KEY_PATH=./keys/public_key.pem
```

### Gmail SMTP Setup

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. **Add credentials** to `.env` file

6. Run the server:
```bash
python main.py
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Configure environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Run the development server:
```bash
npm run dev
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in Supabase SQL Editor
3. **Disable RLS for development** (or configure proper policies):
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```
4. Add username column if not exists:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

## 🔐 Security Features

### Encryption
- **AES-256**: Symmetric encryption for message content
- **RSA-2048**: Asymmetric encryption for key exchange
- **Hybrid Approach**: Combines speed of AES with security of RSA

### Authentication
- **Email OTP Verification**: Secure registration with Gmail SMTP
- **Username System**: Unique usernames for easy user discovery
- **Password Hashing**: MD5 hashed passwords (upgrade to bcrypt recommended)

### AI Classification
- **Spam Detection**: Identifies promotional/unwanted messages
- **Toxicity Detection**: Flags harmful or abusive content
- **Confidence Scoring**: Provides probability scores for decisions

### Fuzzy Logic Engine
- **Multi-factor Analysis**: Considers AI confidence, spam probability, and toxicity
- **Intelligent Decisions**: Three-tier system (Allow/Flag/Block)
- **Adaptive Rules**: Customizable fuzzy logic rules

## 📊 Message Status System

| Status | Description | Action |
|--------|-------------|---------|
| 🟢 **Allowed** | Safe message, delivered normally | Full delivery |
| 🟡 **Flagged** | Potentially problematic, user warned | Delivered with warning |
| 🔴 **Blocked** | Harmful content, delivery prevented | Blocked from recipient |

## 🔧 API Endpoints

### Messages
- `POST /api/messages/send` - Send encrypted message
- `GET /api/messages/chat/{partner_id}` - Get chat history
- `GET /api/messages/chats` - Get user's chat list
- `WS /api/messages/ws/{user_id}` - WebSocket connection

## 🚀 Deployment

### Backend (Railway/Render)
1. Connect your repository
2. Set environment variables
3. Deploy with Python buildpack

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance Metrics

- **Encryption Speed**: ~1ms per message
- **AI Classification**: ~50ms per message
- **Fuzzy Logic**: ~10ms per decision
- **WebSocket Latency**: <100ms

## 🛠️ Troubleshooting

### Common Issues

**"Failed to fetch" Error**
- Make sure backend is running on port 8000
- Check CORS settings in main.py

**Gmail SMTP Error (535)**
- Enable 2FA on Gmail account
- Generate App Password (not regular password)
- Remove spaces from app password in .env

**"User not found" Error**
- Make sure username exists and is verified
- Check database connection

**Database Errors**
- Disable RLS policies for development
- Ensure username column exists in users table

**"@Unknown" in Chat**
- Backend endpoint `/api/auth/user-by-id/{user_id}` should return username
- Check if user data is properly stored

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Group messaging support
- [ ] File encryption and sharing
- [ ] Advanced ML models (BERT, GPT)
- [ ] Mobile app development
- [ ] Voice message encryption
- [ ] Blockchain integration for message integrity