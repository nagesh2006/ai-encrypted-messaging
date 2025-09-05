from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from app.models.message import MessageCreate, MessageResponse, DecryptedMessage
from app.utils.crypto import crypto_manager
from app.services.ai_classifier import ai_classifier
from app.services.fuzzy_logic import fuzzy_engine
from app.services.supabase_client import supabase_service
import json
from datetime import datetime
import uuid

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
    
    async def send_message(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(json.dumps(message))

manager = ConnectionManager()

@router.post("/send", response_model=MessageResponse)
async def send_message(message: MessageCreate):
    try:
        # Encrypt the message
        encrypted_data = crypto_manager.encrypt_message(message.content)
        
        # Classify message with AI
        ai_result = ai_classifier.classify_message(message.content)
        
        # Apply fuzzy logic
        fuzzy_result = fuzzy_engine.make_decision(ai_result)
        
        # Prepare message data
        message_data = {
            "id": str(uuid.uuid4()),
            "sender_id": message.sender_id,
            "recipient_id": message.recipient_id,
            "encrypted_content": json.dumps(encrypted_data),
            "status": fuzzy_result['decision'],
            "ai_score": ai_result['confidence'],
            "fuzzy_score": fuzzy_result['score'],
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Save to database
        saved_message = await supabase_service.save_message(message_data)
        
        # Send real-time notification to recipient
        await manager.send_message(message.recipient_id, {
            "type": "new_message",
            "message": saved_message
        })
        
        return MessageResponse(**saved_message)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/{chat_partner_id}")
async def get_chat_messages(chat_partner_id: str, user_id: str):
    try:
        messages = await supabase_service.get_messages(user_id, chat_partner_id)
        
        # Decrypt messages for display
        decrypted_messages = []
        for msg in messages:
            try:
                encrypted_data = json.loads(msg['encrypted_content'])
                decrypted_content = crypto_manager.decrypt_message(encrypted_data)
                
                decrypted_msg = DecryptedMessage(
                    id=msg['id'],
                    sender_id=msg['sender_id'],
                    recipient_id=msg['recipient_id'],
                    content=decrypted_content,
                    status=msg['status'],
                    ai_score=msg['ai_score'],
                    fuzzy_score=msg['fuzzy_score'],
                    created_at=msg['created_at']
                )
                decrypted_messages.append(decrypted_msg)
            except Exception as e:
                # Skip corrupted messages
                continue
        
        return decrypted_messages
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chats")
async def get_user_chats(user_id: str):
    try:
        chats = await supabase_service.get_user_chats(user_id)
        return chats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if needed
    except WebSocketDisconnect:
        manager.disconnect(user_id)