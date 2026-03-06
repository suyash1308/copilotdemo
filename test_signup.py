import requests
import json

# Test data
test_user = {
    "username": "testuser789",
    "email": "test789@example.com",
    "password": "TestPass123",
    "password_confirm": "TestPass123",
    "first_name": "Test",
    "last_name": "User"
}

# API endpoint
url = "http://localhost:5000/api/auth/signup"

print("=" * 60)
print("🧪 Testing Signup API")
print("=" * 60)
print(f"\n📤 Sending request to: {url}")
print(f"📦 Data: {json.dumps(test_user, indent=2)}")

try:
    # Send POST request
    response = requests.post(url, json=test_user, timeout=5)
    
    print(f"\n✅ Response Status: {response.status_code}")
    print(f"📊 Response Data:")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 201:
        print("\n✅ User signup successful!")
        print("📍 Check MongoDB Compass to verify the user was stored.")
    else:
        print(f"\n❌ Signup failed with status {response.status_code}")
        
except requests.exceptions.ConnectionError:
    print("\n❌ Connection Error: Cannot reach backend server on http://localhost:5000")
    print("   Make sure the backend is running: python app.py")
except requests.exceptions.Timeout:
    print("\n❌ Timeout: Backend server is not responding")
except Exception as e:
    print(f"\n❌ Error: {str(e)}")

print("\n" + "=" * 60)
