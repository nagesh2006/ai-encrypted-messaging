from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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
    result = await auth_service.login_user(request.email, request.password)
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