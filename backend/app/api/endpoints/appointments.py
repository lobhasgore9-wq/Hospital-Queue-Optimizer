from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class AppointmentCreate(BaseModel):
    id: Optional[str] = None
    patientName: str
    doctor: str
    department: str
    date: str
    time: str
    status: str = "pending"
    type: str = "regular"
    notes: str = ""

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

from datetime import date as date_obj

today_str = date_obj.today().isoformat()

appointments_db = [
    {"id": "1", "patientName": "Rahul Kumar", "doctor": "Dr. Priya Sharma", "department": "OPD", "date": today_str, "time": "09:00", "status": "confirmed", "type": "regular", "notes": "Routine check-up"},
    {"id": "2", "patientName": "Sunita Devi", "doctor": "Dr. Rajesh Gupta", "department": "Cardiology", "date": today_str, "time": "09:30", "status": "confirmed", "type": "follow-up", "notes": "Post-surgery follow-up"},
    {"id": "3", "patientName": "Mohammed Ali", "doctor": "Dr. Ananya Patel", "department": "Pediatrics", "date": today_str, "time": "10:00", "status": "pending", "type": "regular", "notes": "Child vaccination"},
    {"id": "4", "patientName": "Geeta Verma", "doctor": "Dr. Sneha Iyer", "department": "Radiology", "date": today_str, "time": "10:30", "status": "completed", "type": "regular", "notes": "X-Ray results review"},
    {"id": "5", "patientName": "Anil Kapoor", "doctor": "Dr. Vikram Singh", "department": "Orthopedics", "date": today_str, "time": "11:00", "status": "no-show", "type": "follow-up", "notes": "Knee pain follow-up"},
    {"id": "6", "patientName": "Preeti Singh", "doctor": "Dr. Meera Krishnan", "department": "OPD", "date": today_str, "time": "11:30", "status": "cancelled", "type": "regular", "notes": "Patient requested cancellation"},
    {"id": "7", "patientName": "Ravi Shankar", "doctor": "Dr. Rajesh Gupta", "department": "Cardiology", "date": today_str, "time": "14:00", "status": "confirmed", "type": "emergency", "notes": "Chest pain evaluation"},
    {"id": "8", "patientName": "Kavita Nair", "doctor": "Dr. Priya Sharma", "department": "OPD", "date": today_str, "time": "15:00", "status": "pending", "type": "regular", "notes": "General consultation"},
    {"id": "9", "patientName": "Deepak Choudhary", "doctor": "Dr. Sanjay Verma", "department": "Pathology", "date": today_str, "time": "16:00", "status": "confirmed", "type": "regular", "notes": "Blood test review"},
    {"id": "10", "patientName": "Lakshmi Narayan", "doctor": "Dr. Ananya Patel", "department": "Pediatrics", "date": today_str, "time": "17:00", "status": "pending", "type": "follow-up", "notes": "Follow-up after fever"},
]

@router.get("")
def get_appointments():
    return appointments_db

@router.post("")
def create_appointment(appt: AppointmentCreate):
    new_appt = {
        "id": appt.id or str(len(appointments_db) + 1),
        **appt.model_dump(exclude={"id"}),
    }
    appointments_db.append(new_appt)
    return new_appt

@router.patch("/{appointment_id}")
def update_appointment(appointment_id: str, update: AppointmentUpdate):
    for idx, a in enumerate(appointments_db):
        if a["id"] == appointment_id:
            update_data = update.model_dump(exclude_unset=True)
            updated = {**a, **update_data}
            appointments_db[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Appointment not found")
