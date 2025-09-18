from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
from app.services.auth_service import auth_service

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp_code: str

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp_code: str
    new_password: str

@router.post("/register")
async def register(request: RegisterRequest):
    result = await auth_service.register_user(request.email, request.username, request.password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    result = await auth_service.verify_otp(request.email, request.otp_code)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/login")
async def login(request: LoginRequest):
    result = await auth_service.login_user(request.email, request.password, request.remember_me)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest):
    result = await auth_service.refresh_token(request.refresh_token)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@router.get("/verify")
async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(" ")[1]
    result = await auth_service.verify_access_token(token)
    if not result["success"]:
        raise HTTPException(status_code=401, detail=result["message"])
    return result

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    result = await auth_service.forgot_password(request.email)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    result = await auth_service.reset_password(request.email, request.otp_code, request.new_password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.get("/user/{username}")
async def get_user_by_username(username: str):
    result = await auth_service.get_user_by_username(username)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@router.get("/user-by-id/{user_id}")
async def get_user_by_id(user_id: str):
    result = await auth_service.get_user_by_id(user_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result