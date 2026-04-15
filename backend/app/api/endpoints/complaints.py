from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class ComplaintCreate(BaseModel):
    title: str
    description: str
    patient_id: Optional[str] = None
    department: Optional[str] = None

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    resolution_notes: Optional[str] = None

class Complaint(BaseModel):
    id: str
    title: str
    description: str
    status: str
    created_at: str
    patient_id: Optional[str] = None
    department: Optional[str] = None
    resolution_notes: Optional[str] = None

complaints_db = [
    {
        "id": "c1",
        "title": "Long wait time in OPD",
        "description": "I have been waiting for over 2 hours for my appointment.",
        "status": "open",
        "created_at": datetime.now().isoformat(),
        "department": "OPD"
    }
]

@router.get("", response_model=List[Complaint])
def get_complaints():
    # TODO: Fetch from Firestore
    # return [doc.to_dict() for doc in firestore_client.collection('complaints').get()]
    return complaints_db

@router.post("", response_model=Complaint)
def create_complaint(complaint: ComplaintCreate):
    # TODO: Save to Firestore
    new_complaint = {
        "id": f"c{len(complaints_db) + 1}",
        **complaint.model_dump(),
        "status": "open",
        "created_at": datetime.now().isoformat()
    }
    complaints_db.append(new_complaint)
    return new_complaint

@router.patch("/{complaint_id}", response_model=Complaint)
def update_complaint(complaint_id: str, complaint_update: ComplaintUpdate):
    # TODO: Update in Firestore
    for idx, c in enumerate(complaints_db):
        if c["id"] == complaint_id:
            update_data = complaint_update.model_dump(exclude_unset=True)
            updated_complaint = {**c, **update_data}
            complaints_db[idx] = updated_complaint
            return updated_complaint
    raise HTTPException(status_code=404, detail="Complaint not found")
