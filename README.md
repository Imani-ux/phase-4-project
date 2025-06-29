# Kazika Kenya Job Board

A full-stack job board platform for Kenya, supporting job seekers, employers, and admins.

## Features

- **Job Seekers:**  
  - Register, login, and manage profile  
  - Browse and apply for jobs  
  - Track application status

- **Employers:**  
  - Register, login, and manage company profile  
  - Post, edit, and delete jobs  
  - View applicants, accept/decline applications  
  - Receive notifications for new applicants

- **Admins:**  
  - Manage users and jobs  
  - View all employers and their job postings

## Tech Stack

- **Backend:** Python, Flask, SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **Frontend:** React.js
- **Database:** SQLite (default, can be changed)

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

2. **Run the backend:**
   ```sh
   cd server
   python run.py
   ```

3. **(Optional) Database migrations:**  
   If you change models, use Alembic or manually update the SQLite DB.

### Frontend

1. **Install dependencies:**
   ```sh
   cd client
   npm install
   ```

2. **Run the frontend:**
   ```sh
   npm run dev
   ```

3. **Access the app:**  
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

- Configure backend settings in `app/config.py` (e.g., secret key, DB URI).
- Frontend expects backend at `http://localhost:5000`.

## Notes

- Make sure CORS is enabled in Flask for frontend-backend communication.
- Default admin, employer, and seeker roles are supported.
- For production, use a production-ready database and secure JWT secret.

---

**Enjoy building with Kazika Kenya!**
