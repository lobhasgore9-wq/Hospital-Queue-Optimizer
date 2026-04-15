from fastapi import APIRouter

router = APIRouter()

# Mock Data
kpi_data = {
  "totalPatients": 202,
  "avgWaitTime": 14.5,
  "tokensCompleted": 89,
  "noShows": 12,
  "emergencyInsertions": 3,
  "activeDoctors": 13,
  "departments": 9,
  "satisfactionScore": 4.3,
  "queueEfficiency": 87,
  "slaBreaches": 2,
}

wait_time_data = [
  {"hour": "8AM", "opd": 12, "cardio": 20, "pedia": 10, "ortho": 15},
  {"hour": "9AM", "opd": 18, "cardio": 25, "pedia": 14, "ortho": 22},
  {"hour": "10AM", "opd": 25, "cardio": 30, "pedia": 18, "ortho": 28},
  {"hour": "11AM", "opd": 22, "cardio": 28, "pedia": 20, "ortho": 25},
  {"hour": "12PM", "opd": 15, "cardio": 22, "pedia": 12, "ortho": 18},
  {"hour": "1PM", "opd": 10, "cardio": 15, "pedia": 8, "ortho": 12},
  {"hour": "2PM", "opd": 20, "cardio": 26, "pedia": 16, "ortho": 24},
  {"hour": "3PM", "opd": 28, "cardio": 32, "pedia": 22, "ortho": 30},
  {"hour": "4PM", "opd": 22, "cardio": 25, "pedia": 15, "ortho": 20},
  {"hour": "5PM", "opd": 14, "cardio": 18, "pedia": 10, "ortho": 14},
]

token_status_data = [
  {"name": "Waiting", "value": 68, "fill": "#f59e0b"},
  {"name": "In Consultation", "value": 24, "fill": "#22c55e"},
  {"name": "Completed", "value": 89, "fill": "#0ea5e9"},
  {"name": "Missed", "value": 12, "fill": "#ef4444"},
  {"name": "Delayed", "value": 9, "fill": "#a855f7"},
]

departments_data = [
  {"id": "opd", "name": "OPD", "prefix": "OPD", "color": "#0ea5e9", "patients": 42, "avgWait": 18, "doctors": 4},
  {"id": "cardio", "name": "Cardiology", "prefix": "CARDIO", "color": "#ef4444", "patients": 28, "avgWait": 25, "doctors": 3},
  {"id": "radio", "name": "Radiology", "prefix": "XRAY", "color": "#a855f7", "patients": 15, "avgWait": 12, "doctors": 2},
  {"id": "path", "name": "Pathology", "prefix": "LAB", "color": "#f59e0b", "patients": 35, "avgWait": 8, "doctors": 2},
  {"id": "pedia", "name": "Pediatrics", "prefix": "PED", "color": "#22c55e", "patients": 22, "avgWait": 20, "doctors": 3},
  {"id": "ortho", "name": "Orthopedics", "prefix": "ORTHO", "color": "#06b6d4", "patients": 19, "avgWait": 22, "doctors": 2},
  {"id": "er", "name": "Emergency", "prefix": "ER", "color": "#dc2626", "patients": 8, "avgWait": 5, "doctors": 3},
]

notifications_data = [
  {"id": 1, "type": "token", "title": "Token Generated", "message": "Token OPD-005 generated for Amit Shah", "time": "2 min ago", "read": False},
  {"id": 2, "type": "alert", "title": "3 Turns Left", "message": "Patient Sunita Devi — your turn is approaching in OPD", "time": "5 min ago", "read": False},
  {"id": 3, "type": "urgent", "title": "Emergency Insertion", "message": "Emergency patient inserted in ER queue — Token ER-002", "time": "8 min ago", "read": True},
]

@router.get("/summary")
def get_dashboard_summary():
    """
    Get all dashboard summary metrics.
    """
    # TODO: Fetch these dynamically from Firestore
    # e.g., tokens = firestore_client.collection('tokens').get()
    return {
        "kpiData": kpi_data,
        "waitTimeData": wait_time_data,
        "tokenStatusData": token_status_data,
        "departments": departments_data,
        "notifications": notifications_data
    }
