import requests
import json

backend_url = "http://localhost:8080"

# Test Signup
print("\n=== Testing Signup ===")
signup_data = {
    "username": "2400032267",
    "email": "2400032267@kluniversity.in",
    "password": "Password123@",
    "role": "STUDENT"
}

try:
    response = requests.post(
        f"{backend_url}/api/auth/signup",
        json=signup_data,
        headers={"Content-Type": "application/json"},
        timeout=5
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✓ SIGNUP SUCCESSFUL!")
except Exception as e:
    print(f"✗ Error: {str(e)}")

# Test Login
print("\n=== Testing Login ===")
login_data = {
    "identifier": "2400032267@kluniversity.in",
    "password": "Password123@"
}

try:
    response = requests.post(
        f"{backend_url}/api/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"},
        timeout=5
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✓ LOGIN SUCCESSFUL!")
        login_result = response.json()
        token = login_result.get("token")
        if token:
            print(f"Token: {token[:30]}...")
            
            # Test authenticated request
            print("\n=== Testing Dashboard Stats ===")
            try:
                stats_response = requests.get(
                    f"{backend_url}/api/feedback/stats",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json"
                    },
                    timeout=5
                )
                print(f"Status: {stats_response.status_code}")
                print(f"Response: {stats_response.text}")
            except Exception as e:
                print(f"✗ Error: {str(e)}")
except Exception as e:
    print(f"✗ Error: {str(e)}")

# Test login with wrong password
print("\n=== Testing Login with Wrong Password ===")
wrong_login_data = {
    "identifier": "2400032267@kluniversity.in",
    "password": "WrongPassword123@"
}

try:
    response = requests.post(
        f"{backend_url}/api/auth/login",
        json=wrong_login_data,
        headers={"Content-Type": "application/json"},
        timeout=5
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        print("✓ CORRECTLY REJECTED WRONG PASSWORD")
except Exception as e:
    print(f"✗ Error: {str(e)}")
