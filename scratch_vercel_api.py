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
# Clear the outputDirectory override and also fix the build command
url_patch = f"https://api.vercel.com/v9/projects/{project_id}"
patch_data = {
    "outputDirectory": None,
    "buildCommand": None,
    "framework": "vite"
}
req_patch = urllib.request.Request(url_patch, headers=headers, data=json.dumps(patch_data).encode('utf-8'), method='PATCH')

try:
    with urllib.request.urlopen(req_patch) as response:
        data = json.loads(response.read().decode())
        print("outputDirectory:", data.get("outputDirectory"))
        print("buildCommand:", data.get("buildCommand"))
        print("framework:", data.get("framework"))
        print("rootDirectory:", data.get("rootDirectory"))
        print("Done!")
except urllib.error.HTTPError as e:
    print("HTTP error:", e.code)
    print(e.read().decode())
except Exception as e:
    print("Error:", e)
