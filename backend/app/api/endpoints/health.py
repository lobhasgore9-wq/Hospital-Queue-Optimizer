from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()
auth_router = APIRouter()

class HealthCheck(BaseModel):
    status: str
    version: str

@router.get("", response_model=HealthCheck)
def get_health():
    """
    Health check endpoint.
    """
    return HealthCheck(status="ok", version="1.0.0")

@auth_router.get("/me")
def get_current_user():
    """
    Mock endpoint for getting the current authenticated user.
    """
    # TODO: Replace with Firebase Auth Verification
    # user = verify_firebase_token(request.headers.get("Authorization"))
    return {
        "id": "mock-user-123",
        "email": "admin@hospital.com",
        "role": "admin",
        "name": "Admin User"
    }
