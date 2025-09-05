from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
import os
import base64

class CryptoManager:
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self._load_or_generate_keys()
    
    def _load_or_generate_keys(self):
        try:
            with open("keys/private_key.pem", "rb") as f:
                self.private_key = serialization.load_pem_private_key(f.read(), password=None)
            with open("keys/public_key.pem", "rb") as f:
                self.public_key = serialization.load_pem_public_key(f.read())
        except FileNotFoundError:
            self._generate_keys()
    
    def _generate_keys(self):
        os.makedirs("keys", exist_ok=True)
        self.private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        self.public_key = self.private_key.public_key()
        
        with open("keys/private_key.pem", "wb") as f:
            f.write(self.private_key.private_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PrivateFormat.PKCS8,
                encryption_algorithm=serialization.NoEncryption()
            ))
        
        with open("keys/public_key.pem", "wb") as f:
            f.write(self.public_key.public_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            ))
    
    def encrypt_message(self, message: str) -> dict:
        # Generate AES key
        aes_key = os.urandom(32)
        iv = os.urandom(16)
        
        # Encrypt message with AES
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv))
        encryptor = cipher.encryptor()
        
        # Pad message
        padded_message = message + (16 - len(message) % 16) * chr(16 - len(message) % 16)
        encrypted_message = encryptor.update(padded_message.encode()) + encryptor.finalize()
        
        # Encrypt AES key with RSA
        encrypted_key = self.public_key.encrypt(
            aes_key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return {
            "encrypted_message": base64.b64encode(encrypted_message).decode(),
            "encrypted_key": base64.b64encode(encrypted_key).decode(),
            "iv": base64.b64encode(iv).decode()
        }
    
    def decrypt_message(self, encrypted_data: dict) -> str:
        # Decrypt AES key with RSA
        encrypted_key = base64.b64decode(encrypted_data["encrypted_key"])
        aes_key = self.private_key.decrypt(
            encrypted_key,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        # Decrypt message with AES
        iv = base64.b64decode(encrypted_data["iv"])
        encrypted_message = base64.b64decode(encrypted_data["encrypted_message"])
        
        cipher = Cipher(algorithms.AES(aes_key), modes.CBC(iv))
        decryptor = cipher.decryptor()
        padded_message = decryptor.update(encrypted_message) + decryptor.finalize()
        
        # Remove padding
        padding_length = padded_message[-1]
        message = padded_message[:-padding_length].decode()
        
        return message

crypto_manager = CryptoManager()