import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

TOKEN = "vcp_060avdvxEfJlPb96A6Ii5LkTyBmZTs9MJRqZAzdYyQ1mcIUTVR1RQY2Y"
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

project_id = "prj_eUAcaExFobebWoTx1bbUOoLyrvdf"
team_id = "team_QwNiAW8ZY5ktAs17S2daplYS"
url = f"https://api.vercel.com/v6/deployments?projectId={project_id}&teamId={team_id}&limit=1"

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        if data.get("deployments"):
            dep = data["deployments"][0]
            print(f"Status: {dep['state']}")
            print(f"URL: {dep['url']}")
            print(f"Created: {dep['created']}")
            if 'error' in dep:
                 print(f"Error: {dep['error']}")
        else:
            print("No deployments found.")
except Exception as e:
    print("Error:", e)
