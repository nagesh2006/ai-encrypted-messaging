from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.messages import router as messages_router
from app.api.auth import router as auth_router
import uvicorn

app = FastAPI(title="AI Encrypted Messaging API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(messages_router, prefix="/api/messages", tags=["messages"])

@app.get("/")
async def root():
    return {"message": "AI Encrypted Messaging API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)