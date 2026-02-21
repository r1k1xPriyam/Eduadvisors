# Edu Advisor - Product Requirements Document

## Overview
Edu Advisor is a comprehensive educational consultancy website with a React frontend, FastAPI backend, and MongoDB database. Fully mobile-responsive design.

## Core Features

### Public Website
- **Landing Page**: Multi-section page with Hero, About, Services, Courses, Colleges, Testimonials, Success Gallery, FAQ, and Contact sections
- **GET COUNSELLING NOW Button**: Prominent CTA button in Hero section that opens the student query popup
- **Success Gallery**: Interactive carousel showcasing student success stories (Engineering, Medical, Graduation, Campus Life, Future Leaders)
- **Course/College Modals**: Clickable courses and colleges showing detailed information
- **Contact Form**: Students can submit queries which are saved to the database
- **Query Popup**: Student lead capture popup with auto-show and manual trigger via button

### Admin Dashboard (`/admin`)
- **Secure Login**: ID: `ADMIN`, Password: `Eduadvisors@2026`
- **Interactive Login Background**: Floating animated icons (Shield, Users, BarChart3, FileCheck)
- **5 Tab Interface**: Student Queries, Consultant Reports, Call Stats, Admissions, Manage Consultants
- **Call Stats Overview Bar**: Shows Total Calls, Successful, Failed, Attempted across all consultants
- **Call Statistics by Consultant**: Table showing each consultant's call breakdown and success rate
- **Student Queries Management**: View, search, filter, delete, and update query status
- **Consultant Reports**: View all daily reports, filter by date and consultant, delete reports
- **Admissions Tracking**: Full CRUD for tracking student admissions and consultant payouts
- **Consultant Management**: Add/Edit/Delete with User ID editable, Full Name read-only
- **Bulk Delete Feature**:
  - Delete data by type (Reports, Calls, Queries, Admissions, All)
  - Filter by consultant
  - Filter by date range
  - **Password re-confirmation required** for sensitive deletion
- **Mobile-Responsive**: Full smartphone compatibility with 2-row tab layout on mobile

### Consultant Portal (`/consultant`)
- **Unique Logins**: 25 consultants with individual credentials
- **Interactive Login Background**: Floating animated icons (Phone, FileText, Award, Target)
- **4 Tab Interface**: Submit Report, My Reports, My Calls, My Admissions
- **Call Stats Bar**: Shows consultant's Total Calls, Successful, Failed, Attempted
- **Quick Log Call Feature**:
  - One-click call logging without full report details
  - Optional fields: Student Name, Contact Number, Remarks
  - Three quick actions: Success, Failed, Attempt
- **Daily Report Submission**: Full detailed student calling reports
- **My Reports Tab**: View own submitted reports with date filter
- **My Calls Tab**: View call statistics breakdown
- **My Admissions Tab**: View admissions credited by admin with payout summary
- **Mobile-Responsive**: Full smartphone compatibility

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB

## API Endpoints

### Call Logging (NEW)
- `POST /api/consultant/calls` - Log a call (quick log, minimal data required)
- `GET /api/consultant/calls/{consultant_id}` - Get consultant's call stats
- `GET /api/admin/calls` - Get all call stats with per-consultant breakdown

### Bulk Delete (NEW)
- `POST /api/admin/bulk-delete` - Bulk delete with password verification
- `POST /api/admin/verify-password` - Verify admin password

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
- `PUT /api/admin/consultants/{user_id}` - Update consultant (User ID and Password only)
- `DELETE /api/admin/consultants/{user_id}` - Delete consultant

## Database Schema
- **student_queries**: `{name, phone, email, course, message, current_institution, status, created_at}`
- **consultant_reports**: `{consultant_name, consultant_id, student_name, contact_number, institution_name, interest_scope, ...}`
- **call_logs** (NEW): `{id, consultant_id, consultant_name, call_type, student_name, contact_number, remarks, created_at}`
- **admissions**: `{id, student_name, course, college, admission_date, consultant_id, consultant_name, payout_amount, payout_status, created_at}`

---

## Implementation Status

### ✅ Completed (Feb 21, 2026)
- Full-stack application with React + FastAPI + MongoDB
- **Mobile-Responsive Design** - All pages fully smartphone compatible
- **Interactive Login Backgrounds** - Floating animated icons on Admin and Consultant login pages
- **Call Logging System** - Quick log calls (successful/failed/attempted) without full report
- **Call Stats for Admin** - View all consultants' call statistics with success rates
- **Call Stats for Consultants** - View own call statistics
- **Bulk Delete with Password Verification** - Delete data by type, consultant, date range
- Landing page with all sections including Success Gallery
- GET COUNSELLING NOW button
- Student query submission system
- Admin dashboard with 5-tab interface
- Admissions Tracking System
- Consultant Management
- Consultant portal with 4-tab interface
- Daily report submission
- Route protection
- Calendar Date Filters
- CSV export functionality

### 🔄 Pending/Backlog
- **Future**: JWT-based authentication
- **Future**: Move consultant credentials to database
- **Future**: Email notifications

---

## Credentials Reference

### Admin
- URL: `/admin`
- User ID: `ADMIN`
- Password: `Eduadvisors@2026`

### Consultants (25 total)
- PRIYAMPATRA / Priyam123!@#
- AK007 / 7001377649
- (See `/app/backend/consultants.py` for full list)
