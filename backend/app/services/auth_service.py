import hashlib
import random
import string
import os
import smtplib
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from app.services.supabase_client import supabase_service
from app.services.jwt_service import jwt_service

class AuthService:
    def __init__(self):
        pass
    
    def _validate_password_strength(self, password: str) -> dict:
        """Validate password strength requirements"""
        errors = []
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters long")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[0-9]', password):
            errors.append("Password must contain at least one number")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            errors.append("Password must contain at least one special character")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    def _hash_password(self, password: str) -> str:
        """Hash password using MD5"""
        return hashlib.md5(password.encode()).hexdigest()
    
    def _generate_otp(self) -> str:
        """Generate 6-digit OTP"""
        return ''.join(random.choices(string.digits, k=6))
    
    def _send_otp_email(self, email: str, otp_code: str) -> bool:
        """Send OTP via Gmail SMTP"""
        try:
            sender_email = os.getenv("GMAIL_USER")
            sender_password = os.getenv("GMAIL_APP_PASSWORD")
            
            if not sender_email or not sender_password:
                print(f"❌ Gmail not configured. OTP for {email}: {otp_code}")
                return False
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = f"AI SecureChat <{sender_email}>"
            msg['To'] = email
            msg['Subject'] = "AI SecureChat - Verification Code"
            
            # HTML body
            html_body = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin: 0;">🛡️ AI SecureChat</h1>
                    <p style="color: #6B7280; margin: 5px 0;">Secure • Encrypted • AI-Protected</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
                    <h2 style="color: white; margin: 0 0 15px 0;">Verification Code</h2>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h1 style="color: white; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">{otp_code}</h1>
                    </div>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">This code expires in 10 minutes</p>
                </div>
                
                <div style="text-align: center; color: #6B7280; font-size: 14px;">
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p style="margin-top: 20px;">🔒 Your security is our priority</p>
                </div>
            </div>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email sent successfully to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Gmail SMTP error: {e}")
            print(f"📱 Fallback - OTP for {email}: {otp_code}")
            return False
    
    async def register_user(self, email: str, username: str, password: str) -> dict:
        """Register new user and send OTP"""
        try:
            # Validate password strength
            password_validation = self._validate_password_strength(password)
            if not password_validation["valid"]:
                return {
                    "success": False, 
                    "message": "; ".join(password_validation["errors"])
                }
            
            # Check if user exists
            existing = await supabase_service.get_user_by_email(email)
            if existing:
                return {"success": False, "message": "Email already exists"}
            
            # Check if username exists
            existing_username = await supabase_service.get_user_by_username(username)
            if existing_username:
                return {"success": False, "message": "Username already exists"}
            
            # Hash password
            password_hash = self._hash_password(password)
            
            # Generate OTP
            otp_code = self._generate_otp()
            otp_expires = datetime.utcnow() + timedelta(minutes=10)
            
            # Create user
            user_data = {
                "email": email,
                "username": username,
                "password_hash": password_hash,
                "otp_code": otp_code,
                "otp_expires_at": otp_expires.isoformat(),
                "is_verified": False
            }
            
            user = await supabase_service.create_user(user_data)
            
            # Send OTP via email
            email_sent = self._send_otp_email(email, otp_code)
            
            if email_sent:
                message = "Registration successful. Check your email for the verification code."
            else:
                message = f"Registration successful. OTP (email failed): {otp_code}"
            
            return {
                "success": True, 
                "message": message,
                "user_id": user["id"]
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def verify_otp(self, email: str, otp_code: str) -> dict:
        """Verify OTP and activate user"""
        try:
            user = await supabase_service.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "User not found"}
            
            # Check OTP
            if user["otp_code"] != otp_code:
                return {"success": False, "message": "Invalid OTP"}
            
            # Check expiry
            otp_expires = datetime.fromisoformat(user["otp_expires_at"].replace('Z', '+00:00'))
            if datetime.utcnow() > otp_expires.replace(tzinfo=None):
                return {"success": False, "message": "OTP expired"}
            
            # Verify user
            await supabase_service.update_user(user["id"], {
                "is_verified": True,
                "otp_code": None,
                "otp_expires_at": None
            })
            
            return {
                "success": True,
                "message": "Account verified successfully",
                "user_id": user["id"]
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def login_user(self, email: str, password: str, remember_me: bool = False) -> dict:
        """Login user with email and password"""
        try:
            user = await supabase_service.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "Invalid credentials"}
            
            # Check password
            password_hash = self._hash_password(password)
            if user["password_hash"] != password_hash:
                return {"success": False, "message": "Invalid credentials"}
            
            # Check if verified
            if not user["is_verified"]:
                return {"success": False, "message": "Account not verified"}
            
            # Create tokens
            access_token = jwt_service.create_access_token(
                user["id"], user["email"], user["username"]
            )
            
            response_data = {
                "success": True,
                "message": "Login successful",
                "user_id": user["id"],
                "email": user["email"],
                "username": user["username"],
                "access_token": access_token
            }
            
            # Add refresh token if remember me is enabled
            if remember_me:
                refresh_token = jwt_service.create_refresh_token(user["id"])
                response_data["refresh_token"] = refresh_token
            
            return response_data
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def verify_otp(self, email: str, otp_code: str) -> dict:
        """Verify OTP and activate user"""
        try:
            user = await supabase_service.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "User not found"}
            
            # Check OTP
            if user["otp_code"] != otp_code:
                return {"success": False, "message": "Invalid OTP"}
            
            # Check expiry
            otp_expires = datetime.fromisoformat(user["otp_expires_at"].replace('Z', '+00:00'))
            if datetime.utcnow() > otp_expires.replace(tzinfo=None):
                return {"success": False, "message": "OTP expired"}
            
            # Verify user
            await supabase_service.update_user(user["id"], {
                "is_verified": True,
                "otp_code": None,
                "otp_expires_at": None
            })
            
            return {
                "success": True,
                "message": "Account verified successfully",
                "user_id": user["id"]
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def get_user_by_username(self, username: str) -> dict:
        """Get user by username for messaging"""
        try:
            user = await supabase_service.get_user_by_username(username)
            if not user:
                return {"success": False, "message": "User not found"}
            
            if not user["is_verified"]:
                return {"success": False, "message": "User not verified"}
            
            return {
                "success": True,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"]
                }
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def refresh_token(self, refresh_token: str) -> dict:
        """Refresh access token using refresh token"""
        try:
            user_id = jwt_service.refresh_access_token(refresh_token)
            if not user_id:
                return {"success": False, "message": "Invalid refresh token"}
            
            # Get user data
            user = await supabase_service.get_user_by_id(user_id)
            if not user or not user["is_verified"]:
                return {"success": False, "message": "User not found or not verified"}
            
            # Create new access token
            access_token = jwt_service.create_access_token(
                user["id"], user["email"], user["username"]
            )
            
            return {
                "success": True,
                "access_token": access_token,
                "user_id": user["id"],
                "email": user["email"],
                "username": user["username"]
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def verify_access_token(self, token: str) -> dict:
        """Verify access token and return user data"""
        try:
            payload = jwt_service.verify_token(token)
            if not payload or payload.get("type") != "access":
                return {"success": False, "message": "Invalid token"}
            
            return {
                "success": True,
                "user_id": payload["user_id"],
                "email": payload["email"],
                "username": payload["username"]
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def forgot_password(self, email: str) -> dict:
        """Send password reset OTP"""
        try:
            user = await supabase_service.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "Email not found"}
            
            if not user["is_verified"]:
                return {"success": False, "message": "Account not verified"}
            
            # Generate OTP
            otp_code = self._generate_otp()
            otp_expires = datetime.utcnow() + timedelta(minutes=10)
            
            # Update user with reset OTP
            await supabase_service.update_user(user["id"], {
                "otp_code": otp_code,
                "otp_expires_at": otp_expires.isoformat()
            })
            
            # Send OTP via email
            email_sent = self._send_reset_otp_email(email, otp_code)
            
            if email_sent:
                message = "Password reset code sent to your email."
            else:
                message = f"Password reset code (email failed): {otp_code}"
            
            return {
                "success": True,
                "message": message
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    async def reset_password(self, email: str, otp_code: str, new_password: str) -> dict:
        """Reset password with OTP"""
        try:
            # Validate new password strength
            password_validation = self._validate_password_strength(new_password)
            if not password_validation["valid"]:
                return {
                    "success": False, 
                    "message": "; ".join(password_validation["errors"])
                }
            
            user = await supabase_service.get_user_by_email(email)
            if not user:
                return {"success": False, "message": "User not found"}
            
            # Check OTP
            if user["otp_code"] != otp_code:
                return {"success": False, "message": "Invalid OTP"}
            
            # Check expiry
            otp_expires = datetime.fromisoformat(user["otp_expires_at"].replace('Z', '+00:00'))
            if datetime.utcnow() > otp_expires.replace(tzinfo=None):
                return {"success": False, "message": "OTP expired"}
            
            # Hash new password
            new_password_hash = self._hash_password(new_password)
            
            # Update password and clear OTP
            await supabase_service.update_user(user["id"], {
                "password_hash": new_password_hash,
                "otp_code": None,
                "otp_expires_at": None
            })
            
            return {
                "success": True,
                "message": "Password reset successfully"
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    def _send_reset_otp_email(self, email: str, otp_code: str) -> bool:
        """Send password reset OTP via Gmail SMTP"""
        try:
            sender_email = os.getenv("GMAIL_USER")
            sender_password = os.getenv("GMAIL_APP_PASSWORD")
            
            if not sender_email or not sender_password:
                print(f"❌ Gmail not configured. Reset OTP for {email}: {otp_code}")
                return False
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = f"AI SecureChat <{sender_email}>"
            msg['To'] = email
            msg['Subject'] = "AI SecureChat - Password Reset Code"
            
            # HTML body
            html_body = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin: 0;">🛡️ AI SecureChat</h1>
                    <p style="color: #6B7280; margin: 5px 0;">Secure • Encrypted • AI-Protected</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
                    <h2 style="color: white; margin: 0 0 15px 0;">Password Reset Code</h2>
                    <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <h1 style="color: white; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">{otp_code}</h1>
                    </div>
                    <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">This code expires in 10 minutes</p>
                </div>
                
                <div style="text-align: center; color: #6B7280; font-size: 14px;">
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p style="margin-top: 20px;">🔒 Your security is our priority</p>
                </div>
            </div>
            """
            
            msg.attach(MIMEText(html_body, 'html'))
            
            # Send email
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Password reset email sent successfully to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Gmail SMTP error: {e}")
            print(f"📱 Fallback - Reset OTP for {email}: {otp_code}")
            return False
    
    async def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID for username lookup"""
        try:
            user = await supabase_service.get_user_by_id(user_id)
            if not user:
                return {"success": False, "message": "User not found"}
            
            if not user["is_verified"]:
                return {"success": False, "message": "User not verified"}
            
            return {
                "success": True,
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "email": user["email"]
                }
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}

auth_service = AuthService()