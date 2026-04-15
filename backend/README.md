# Hospital Queue Optimizer - Backend

This is the FastAPI backend for the Hospital Queue Optimizer project.

## Project Structure

- `app/main.py`: The FastAPI application entrypoint.
- `app/core/config.py`: Configuration variables and `.env` parsing.
- `app/api/`: API router and endpoints.
- `app/models/`: (Future) Pydantic/Firestore models.
- `app/schemas/`: (Future) Request/Response schemas.
- `app/services/`: (Future) Business logic, external API integrations like Firebase/Firestore.

## Prerequisites

- Python 3.9+
- Virtual environment

## Setup Instructions

1. **Create a virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Variables:**
   Copy the example config:
   ```bash
   cp .env.example .env
   ```

5. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.
   API Documentation: `http://localhost:8000/docs`

## Firebase & Firestore Integration Guide

This backend is structured to allow easy integration with Firebase Authentication and Firestore DB. 
Search for `TODO: Fetch from Firestore` or `TODO: Save to Firestore` in the codebase to find exactly where you need to drop your queries.

1. In `app/core/config.py`, place your Firebase credentials in `.env`.
2. Create a service module in `app/services/firebase.py` to initialize `firebase-admin` using the service account credentials.
3. Update routing methods (e.g. `app/api/endpoints/tokens.py`) to fetch data from Firestore.
4. Replace the `/api/v1/auth/me` logic in `app/api/endpoints/health.py` with an actual dependency that verifies a Firebase token from requests.
