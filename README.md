# BMDU Employee Management System

A responsive employee directory built with React, Express, and MongoDB. Administrators can create, view, search, update, and delete employee records.

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB Community Server running locally on `mongodb://localhost:27017`

## Setup

1. Start MongoDB.
2. Create `backend/.env` with:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/employeeDB
   ```

3. In a terminal, install and start the backend:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

4. In a second terminal, install and start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open the local Vite URL shown in the frontend terminal. To test on a phone, use Vite's Network URL while the phone and computer are on the same Wi-Fi. Allow Node.js through Windows Firewall on private networks if prompted.

## Features

- Employee dashboard with roster and status statistics
- Search employees by name, email, department, or designation
- Filter employees by active or inactive status
- Create, edit, and delete employee records
- Responsive layout with mobile navigation
- Employee fields: name, email, phone, department, designation, joining date, and status

## API

The backend runs on port `5000` by default.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API and database connection |
| `GET` | `/api/employees` | List employees |
| `GET` | `/api/employees/:id` | Get one employee |
| `POST` | `/api/employees` | Create an employee |
| `PUT` | `/api/employees/:id` | Update an employee |
| `DELETE` | `/api/employees/:id` | Delete an employee |

Employee status is `active` or `inactive`; new records default to `active`.
