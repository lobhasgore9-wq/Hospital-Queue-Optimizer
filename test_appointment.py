import requests
import json

url = "http://localhost:8000/api/v1/appointments"
payload = {
    "patientName": "Script Test",
    "doctor": "Dr. Priya Sharma",
    "department": "OPD",
    "date": "2026-04-15",
    "time": "11:00",
    "status": "pending",
    "type": "regular",
    "notes": "Testing from script"
}
headers = {
    'Content-Type': 'application/json',
    'Origin': 'http://localhost:8080'
}

# Test OPTIONS (Preflight)
print("Testing OPTIONS...")
resp_opt = requests.options(url, headers={'Origin': 'http://localhost:8080', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type'})
print(f"OPTIONS Status: {resp_opt.status_code}")
print(f"OPTIONS Headers: {resp_opt.headers}")

# Test POST
print("\nTesting POST...")
resp_post = requests.post(url, json=payload, headers=headers)
print(f"POST Status: {resp_post.status_code}")
print(f"POST Content: {resp_post.text}")
