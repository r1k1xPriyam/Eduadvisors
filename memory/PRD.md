# Edu Advisor - Product Requirements Document

## Overview
Edu Advisor is a comprehensive educational consultancy website with a React frontend, FastAPI backend, and MongoDB database.

## Core Features

### Public Website
- **Landing Page**: Multi-section page with Hero, About, Services, Courses, Colleges, Testimonials, Success Gallery, FAQ, and Contact sections
- **GET COUNSELLING NOW Button**: Prominent CTA button in Hero section that opens the student query popup
- **Success Gallery**: Interactive carousel showcasing student success stories (Engineering, Medical, Graduation, Campus Life, Future Leaders)
- **Course/College Modals**: Clickable courses and colleges showing detailed information
- **Contact Form**: Students can submit queries which are saved to the database
- **Query Popup**: Student lead capture popup with auto-show and manual trigger via button

### Admin Dashboard (`/admin`)
- **Secure Login**: ID: `ADMIN`, Password: `EDUadvisors@souvikCEO2026`
- **4 Tab Interface**: Student Queries, Consultant Reports, Admissions, Manage Consultants
- **Student Queries Management**: View, search, filter, delete, and update query status (New → Contacted → Closed)
- **Consultant Reports**: View all daily reports, filter by date and consultant, delete reports
- **Admissions Tracking**: 
  - Add/Edit/Delete student admission records
  - Fields: Student Name, Course, College, Admission Date, Consultant, Payout Amount, Payout Status
  - Payout Status options: PAYOUT NOT CREDITED YET, PAYOUT REFLECTED, CONSULTANT'S COMMISION GIVEN
  - Stats cards showing admission counts and payout status breakdown
- **Consultant Management**:
  - Add new consultants with User ID, Name, Password
  - Edit consultants: User ID and Password EDITABLE, Full Name READ-ONLY
  - Delete consultants
- **Calendar Date Filter**: Filter reports by specific date
- **Export to CSV**: Export queries and reports

### Consultant Portal (`/consultant`)
- **Unique Logins**: 25 consultants with individual credentials
- **3 Tab Interface**: Submit Report, My Reports, My Admissions
- **Daily Report Submission**: Consultants submit student calling reports
- **My Reports Tab**: View own submitted reports with date filter
- **My Admissions Tab**: 
  - View admissions credited by admin
  - Stats: Total Admissions, Total Earnings, Payout Received
  - Payout Summary: Pending, Reflected, Received amounts
- **Protected Routes**: Only authenticated consultants can access

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB

## API Endpoints

### Student Queries
- `GET /api/queries` - Fetch all student queries
- `POST /api/queries` - Submit new query
- `PATCH /api/queries/{query_id}/status` - Update query status
- `DELETE /api/queries/{query_id}` - Delete query

### Consultant Reports
- `POST /api/consultant/login` - Authenticate consultant
- `POST /api/consultant/reports` - Submit consultant report
- `GET /api/consultant/reports/{consultant_id}` - Fetch reports for specific consultant
- `GET /api/admin/consultant-reports` - Fetch all consultant reports
- `DELETE /api/consultant/reports/{report_id}` - Delete report

### Admissions
- `POST /api/admin/admissions` - Create admission record
- `GET /api/admin/admissions` - Get all admissions
- `PUT /api/admin/admissions/{admission_id}` - Update admission
- `DELETE /api/admin/admissions/{admission_id}` - Delete admission
- `GET /api/consultant/admissions/{consultant_id}` - Get consultant's credited admissions

### Consultant Management
- `GET /api/admin/consultants` - Get all consultants
- `POST /api/admin/consultants` - Add new consultant
- `PUT /api/admin/consultants/{user_id}` - Update consultant (User ID and Password only, NOT name)
- `DELETE /api/admin/consultants/{user_id}` - Delete consultant

## Database Schema
- **student_queries**: `{name, phone, email, course, message, current_institution, status, created_at}`
- **consultant_reports**: `{consultant_name, consultant_id, student_name, contact_number, institution_name, interest_scope, ...}`
- **admissions**: `{id, student_name, course, college, admission_date, consultant_id, consultant_name, payout_amount, payout_status, created_at}`
- **consultants**: Stored in-memory (consultants.py) - `{user_id: {name, password}}`

---

## Implementation Status

### ✅ Completed (Feb 6, 2026)
- Full-stack application with React + FastAPI + MongoDB
- Landing page with all sections including Success Gallery
- **GET COUNSELLING NOW button** - Opens student query popup from Hero section
- Student query submission system with popup and form section
- Admin dashboard with 4-tab interface
- **Admissions Tracking System** - Full CRUD for tracking student admissions and consultant payouts
- **Consultant Management** - Add/Edit/Delete with User ID editable, Full Name read-only restriction
- Consultant portal with 3-tab interface including "My Admissions"
- Daily report submission for consultants
- Route protection for admin and consultant dashboards
- IST timestamp formatting
- CSV export functionality
- Delete functionality for queries, reports, and admissions
- **Success Gallery** - Interactive carousel with 5 categories (removed Study Abroad)
- Calendar Date Filters for Admin and Consultant dashboards

### 🔄 Pending/Backlog
- **Future**: JWT-based authentication (currently using localStorage)
- **Future**: Move consultant credentials from in-memory to database
- **Future**: Add pagination for large datasets
- **Future**: Email notifications for new queries/admissions

---

## Credentials Reference

### Admin
- URL: `/admin`
- User ID: `ADMIN`
- Password: `EDUadvisors@souvikCEO2026`

### Consultants (25 total)
- PRIYAMPATRA / Priyam123!@#
- AK007 / 7001377649
- NILKANTHA / nil12345
- SWARAJ_EDU / Swaraj@5533
- SOYALI_EDU / Soyali2026@
- (See `/app/backend/consultants.py` for full list)
