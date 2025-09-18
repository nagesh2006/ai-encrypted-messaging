# 🤖 AI SecureChat - Intelligent Encrypted Messaging

A next-generation secure messaging platform that combines military-grade encryption with AI-powered content filtering and fuzzy logic decision making for the ultimate communication experience.

## ✨ Key Features

### 🔐 Security & Encryption
- **End-to-End Encryption**: AES-256 + RSA-2048 hybrid encryption
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Remember Me**: 30-day persistent sessions with auto-login
- **Secure OTP**: Gmail SMTP email verification system

### 🤖 AI-Powered Protection
- **Advanced AI Classification**: Enhanced machine learning with 300+ training samples
- **Fuzzy Logic Engine**: 13 sophisticated rules with context-aware decision making
- **Real-time Analysis**: Instant spam/toxicity detection with confidence scoring
- **Multi-factor Evaluation**: Considers message content, length, and context

### 💬 Communication Features
- **Real-time Messaging**: WebSocket-based instant communication
- **Username Discovery**: Easy user search and chat initiation
- **Message Status System**: Allow/Flag/Block with visual indicators
- **Chat History**: Encrypted message storage and retrieval

### 🎨 User Experience
- **Modern Glassmorphism UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **AI Visualization**: Real-time display of message safety metrics
- **Status Indicators**: Visual feedback for message security levels

## 🏗️ Architecture

```
Frontend (Next.js + TypeScript + TailwindCSS)
    ↓ JWT Authentication
Backend (FastAPI + Python)
    ↓ Encrypted Storage
Database (Supabase PostgreSQL)
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Scikit-learn**: Enhanced ML with Logistic Regression
- **PyJWT**: JWT token management
- **Cryptography**: AES/RSA encryption implementation
- **Supabase**: Database and real-time features
- **WebSockets**: Real-time communication

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **Auth Manager**: Centralized token management

## 📦 Quick Start

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

## 🔐 Security Architecture

### Multi-Layer Encryption
- **AES-256**: Symmetric encryption for message content
- **RSA-2048**: Asymmetric encryption for key exchange
- **Hybrid Approach**: Combines AES speed with RSA security
- **JWT Tokens**: Secure authentication with refresh capability

### Advanced AI Protection
- **Enhanced Training**: 300+ diverse message samples
- **Logistic Regression**: Superior accuracy over Naive Bayes
- **Context Analysis**: Message length and content evaluation
- **Entropy-based Confidence**: More accurate probability scoring

### Intelligent Fuzzy Logic
- **5-Level Granularity**: very_low → very_high membership functions
- **13 Sophisticated Rules**: Context-aware decision making
- **Multi-criteria Evaluation**: Toxicity, spam, confidence, length
- **Weighted Aggregation**: Combines multiple rule activations

## 📊 AI Decision System

| Status | Criteria | Action |
|--------|----------|--------|
| 🟢 **Allowed** | Low spam/toxicity + High confidence | Full delivery |
| 🟡 **Flagged** | Medium risk or Low confidence | Delivered with warning |
| 🔴 **Blocked** | High toxicity or High spam + High confidence | Blocked from recipient |

### Enhanced Detection
- **Context-Aware**: Message length influences decisions
- **Multi-Factor**: Combines AI confidence with content analysis
- **Adaptive Thresholds**: Dynamic decision boundaries
- **Rule Transparency**: Detailed reasoning for each decision

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with OTP
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/login` - Login with remember me
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token validity

### Messages
- `POST /api/messages/send` - Send encrypted message
- `GET /api/messages/chat/{partner_id}` - Get chat history
- `GET /api/messages/chats` - Get user's chat list
- `WS /api/messages/ws/{user_id}` - WebSocket connection

## 🚀 Deployment

For detailed deployment instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Quick Deploy Options
- **Railway + Vercel**: Recommended for beginners (~$5/month)
- **Render**: Full-stack option (~$7/month)
- **Docker**: Self-hosted deployment
- **Cloud Providers**: AWS, GCP, Azure for enterprise

## 🧪 Performance Metrics

- **Message Encryption**: <1ms per message
- **AI Classification**: ~50ms with enhanced model
- **Fuzzy Logic Processing**: ~10ms with 13 rules
- **WebSocket Latency**: <100ms
- **Cross-validation Accuracy**: >90% with expanded dataset

## 🛠️ Recent Improvements

### v2.0 Features
- **Remember Me**: 30-day persistent sessions with JWT
- **Enhanced AI**: 300+ training samples, Logistic Regression
- **Advanced Fuzzy Logic**: 13 context-aware rules
- **Auto-login**: Seamless user experience
- **Better Security**: Industry-standard JWT authentication

For troubleshooting, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <h3>🚀 Ready to deploy your secure messaging platform?</h3>
  <p>See <a href="SETUP_GUIDE.md">SETUP_GUIDE.md</a> for detailed instructions</p>
  
  [![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template)
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)
  [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)
</div>