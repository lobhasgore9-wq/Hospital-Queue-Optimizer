import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://api.render.com/v1/services"
headers = {
    "Authorization": "Bearer rnd_C7X2hvI0BTK0TciPx6TRxOxyrZfC",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

data = {
  "ownerId": "tea-d7fl7jnavr4c73coobjg",
  "type": "web_service",
  "name": "hospital-queue-optimizer",
  "repo": "https://github.com/lobhasgore9-wq/Hospital-Queue-Optimizer",
  "autoDeploy": "yes",
  "serviceDetails": {
    "env": "python",
    "plan": "free",
    "rootDir": "backend",
    "envSpecificDetails": {
      "buildCommand": "pip install -r requirements.txt",
      "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    },
    "envVars": [
      {
        "key": "PYTHON_VERSION",
        "value": "3.10.9"
      }
    ]
  }
}

req = urllib.request.Request(url, headers=headers, data=json.dumps(data).encode('utf-8'))
try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTP error:", e.code)
    print(e.read().decode())
except Exception as e:
    print(e)
