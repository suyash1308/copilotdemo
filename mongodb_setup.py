#!/usr/bin/env python3
"""
Quick MongoDB Setup and Verification Script
"""

import os
import sys

def check_mongodb_driver():
    """Check if pymongo is installed"""
    try:
        import pymongo
        print("✓ pymongo installed:", pymongo.__version__)
        return True
    except ImportError:
        print("✗ pymongo not installed")
        print("  Install with: pip install pymongo dnspython")
        return False

def check_mongodb_local():
    """Check if local MongoDB is running"""
    try:
        from pymongo import MongoClient
        client = MongoClient('mongodb://localhost:27017/', serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        print("✓ Local MongoDB is running on localhost:27017")
        return True
    except Exception as e:
        print("✗ Local MongoDB not running")
        print(f"  Error: {str(e)}")
        return False

def print_setup_options():
    """Print setup options"""
    print("\n" + "="*70)
    print("🌐 MONGODB SETUP OPTIONS")
    print("="*70)
    print("\n1. MongoDB Atlas (Cloud) - RECOMMENDED ✅")
    print("   • No installation needed")
    print("   • Free tier: 512MB storage")
    print("   • Setup: https://www.mongodb.com/cloud/atlas")
    print("   • Time: ~5 minutes")
    
    print("\n2. MongoDB Local Installation")
    print("   • Windows: Download from mongodb.com")
    print("   • macOS: brew install mongodb-community")
    print("   • Linux: apt-get install mongodb")
    print("   • Time: ~10 minutes")
    
    print("\n3. MongoDB Docker (If Docker installed)")
    print("   docker run -d -p 27017:27017 --name mongodb mongo:latest")
    print("   • Time: ~2 minutes")
    
    print("\n" + "="*70)

def main():
    print("\n" + "="*70)
    print("🔧 MONGODB SETUP VERIFICATION")
    print("="*70 + "\n")
    
    # Check Python driver
    driver_ok = check_mongodb_driver()
    
    if not driver_ok:
        print("\n⚠️  Please install MongoDB Python driver first:")
        print("   pip install pymongo dnspython")
        return False
    
    print()
    
    # Check local MongoDB
    local_ok = check_mongodb_local()
    
    if not local_ok:
        print("\n💡 MongoDB not detected locally.")
        print_setup_options()
        print("\n📖 See MONGODB_SETUP.md for detailed instructions")
    else:
        print("\n✅ Local MongoDB is ready to use!")
        print("   • Database will save to: ./instance/auth_app.db")
        print("   • Connection: mongodb://localhost:27017/auth_app")
    
    print("\n" + "="*70)
    print("📝 NEXT STEPS:")
    print("="*70)
    print("\n1. Choose MongoDB option (Atlas or Local)")
    print("2. Configure MONGO_URI in backend/config.py")
    print("3. Start backend: python app.py")
    print("4. Start frontend: python -m http.server 8000")
    print("5. Open browser: http://localhost:8000")
    print("\n" + "="*70 + "\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
