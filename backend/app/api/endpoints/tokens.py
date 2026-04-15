from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

tokens_db = [
  {"id": "1", "number": "OPD-001", "patientName": "Rahul Kumar", "department": "OPD", "doctor": "Dr. Priya Sharma", "status": "in-consultation", "priority": "normal", "eta": 0, "position": 0, "registeredAt": "08:30", "type": "appointment"},
  {"id": "2", "number": "OPD-002", "patientName": "Sunita Devi", "department": "OPD", "doctor": "Dr. Priya Sharma", "status": "called", "priority": "senior", "eta": 2, "position": 1, "registeredAt": "08:35", "type": "walk-in"},
  {"id": "3", "number": "OPD-003", "patientName": "Mohammed Ali", "department": "OPD", "doctor": "Dr. Meera Krishnan", "status": "waiting", "priority": "normal", "eta": 12, "position": 2, "registeredAt": "08:40", "type": "appointment"},
  {"id": "4", "number": "CARDIO-001", "patientName": "Lakshmi Narayan", "department": "Cardiology", "doctor": "Dr. Rajesh Gupta", "status": "in-consultation", "priority": "emergency", "eta": 0, "position": 0, "registeredAt": "08:15", "type": "walk-in"},
]

@router.get("")
def read_tokens():
    # TODO: Fetch from Firestore
    # return [doc.to_dict() for doc in firestore_client.collection('tokens').get()]
    return tokens_db

@router.get("/{token_id}")
def read_token(token_id: str):
    # TODO: Fetch from Firestore
    for t in tokens_db:
        if t["id"] == token_id:
            return t
    return {"error": "Not found"}

class TokenCreate(BaseModel):
    id: str
    number: str
    patientName: str
    department: str
    doctor: str
    status: str
    priority: str
    eta: int
    position: int
    registeredAt: str
    type: str

@router.post("")
def create_token(token: TokenCreate):
    new_token = token.dict()
    tokens_db.append(new_token) 
    return new_token

