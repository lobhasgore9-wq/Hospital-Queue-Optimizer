from fastapi import APIRouter

from app.api.endpoints import health, dashboard, tokens, complaints, appointments

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(tokens.router, prefix="/tokens", tags=["tokens"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(health.auth_router, prefix="/auth", tags=["auth"])
