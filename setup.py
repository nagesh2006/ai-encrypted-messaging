#!/usr/bin/env python3
"""
Setup script for AI Encrypted Messaging System
"""

import os
import subprocess
import sys

def run_command(command, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, 
                              capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def setup_backend():
    """Setup backend environment"""
    print("🐍 Setting up Backend...")
    
    backend_dir = os.path.join(os.getcwd(), 'backend')
    
    # Create virtual environment
    print("Creating virtual environment...")
    success, output = run_command("python -m venv venv", backend_dir)
    if not success:
        print(f"❌ Failed to create virtual environment: {output}")
        return False
    
    # Activate and install dependencies
    print("Installing Python dependencies...")
    if os.name == 'nt':  # Windows
        pip_path = os.path.join(backend_dir, 'venv', 'Scripts', 'pip')
    else:  # Unix/Linux/Mac
        pip_path = os.path.join(backend_dir, 'venv', 'bin', 'pip')
    
    success, output = run_command(f"{pip_path} install -r requirements.txt", backend_dir)
    if not success:
        print(f"❌ Failed to install dependencies: {output}")
        return False
    
    print("✅ Backend setup complete!")
    return True

def setup_frontend():
    """Setup frontend environment"""
    print("⚛️ Setting up Frontend...")
    
    frontend_dir = os.path.join(os.getcwd(), 'frontend')
    
    # Install dependencies
    print("Installing Node.js dependencies...")
    success, output = run_command("npm install", frontend_dir)
    if not success:
        print(f"❌ Failed to install dependencies: {output}")
        return False
    
    print("✅ Frontend setup complete!")
    return True

def create_env_files():
    """Create environment files from examples"""
    print("📝 Creating environment files...")
    
    # Backend .env
    backend_env_example = os.path.join('backend', '.env.example')
    backend_env = os.path.join('backend', '.env')
    
    if os.path.exists(backend_env_example) and not os.path.exists(backend_env):
        with open(backend_env_example, 'r') as f:
            content = f.read()
        with open(backend_env, 'w') as f:
            f.write(content)
        print("✅ Created backend/.env")
    
    # Frontend .env.local
    frontend_env_example = os.path.join('frontend', '.env.local.example')
    frontend_env = os.path.join('frontend', '.env.local')
    
    if os.path.exists(frontend_env_example) and not os.path.exists(frontend_env):
        with open(frontend_env_example, 'r') as f:
            content = f.read()
        with open(frontend_env, 'w') as f:
            f.write(content)
        print("✅ Created frontend/.env.local")

def main():
    """Main setup function"""
    print("🚀 AI Encrypted Messaging System Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not os.path.exists('backend') or not os.path.exists('frontend'):
        print("❌ Please run this script from the project root directory")
        sys.exit(1)
    
    # Create environment files
    create_env_files()
    
    # Setup backend
    if not setup_backend():
        print("❌ Backend setup failed")
        sys.exit(1)
    
    # Setup frontend
    if not setup_frontend():
        print("❌ Frontend setup failed")
        sys.exit(1)
    
    print("\n🎉 Setup complete!")
    print("\n📋 Next steps:")
    print("1. Configure your Supabase credentials in backend/.env and frontend/.env.local")
    print("2. Run the database schema in your Supabase project")
    print("3. Start the backend: cd backend && python main.py")
    print("4. Start the frontend: cd frontend && npm run dev")
    print("5. Test the system: python test_system.py")

if __name__ == "__main__":
    main()