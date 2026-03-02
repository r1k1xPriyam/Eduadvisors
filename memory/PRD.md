# Edu Advisor - Product Requirements Document

## Overview
Edu Advisor is a comprehensive educational consultancy website with a React frontend, FastAPI backend, and MongoDB database. Fully mobile-responsive design with light/dark theme support.

## Core Features

### Public Website
- **Landing Page**: Multi-section page with Hero, About, Services, Courses, Colleges, Testimonials, Success Gallery, FAQ, and Contact sections
- **GET COUNSELLING NOW Button**: Prominent CTA button in Hero section that opens the student query popup
- **Success Gallery**: Interactive carousel showcasing student success stories (Engineering, Medical, Graduation, Campus Life, Future Leaders)
- **Course/College Modals**: Clickable courses and colleges showing detailed information
- **Contact Form**: Students can submit queries which are saved to the database
- **Query Popup**: Student lead capture popup with auto-show and manual trigger via button
- **Light/Dark Theme**: Full dark mode support across all pages

### Admin Dashboard (`/admin`)
- **Secure Login**: ID: `ADMIN`, Password: `EDUadvisors@souvikCEO2026`
- **Interactive Login Background**: Floating animated icons (Shield, Users, BarChart3, FileCheck)
- **Light/Dark Theme Toggle**: Full dark mode support
- **6 Tab Interface**: Student Queries, Consultant Reports, Call Stats, Admissions, Manage Consultants, Reminders
- **Call Stats Overview Bar**: Shows Total Calls, Successful, Failed, Attempted across all consultants
- **Call Statistics by Consultant**: Table showing each consultant's call breakdown, success rate, and DELETE action
- **Clickable Call Stats**: Click on any call stat (Total/Successful/Failed/Attempted) to view detailed call list
- **Delete Call Stats per Consultant**: Admin can delete all call statistics for a specific consultant with password confirmation
- **Reminders Tab**: View all consultant follow-up reminders categorized as Overdue, Today, Upcoming
- **Student Queries Management**: View, search, filter, delete, and update query status
- **Consultant Reports**: View all daily reports, filter by date and consultant, delete reports
- **Admissions Tracking**: Full CRUD for tracking student admissions and consultant payouts
- **Consultant Management**: Add/Edit/Delete with User ID editable, Full Name read-only
- **Bulk Delete Feature**:
  - Delete data by type (Reports, Calls, Queries, Admissions, All)
  - Filter by consultant
  - Filter by date range
  - **Password re-confirmation required** for sensitive deletion
- **Mobile-Responsive**: Full smartphone compatibility with horizontally scrollable tabs

### Consultant Portal (`/consultant`)
- **Unique Logins**: 25 consultants with individual credentials
- **Interactive Login Background**: Floating animated icons (Phone, FileText, Award, Target)
- **Light/Dark Theme Toggle**: Full dark mode support
- **5 Tab Interface**: Submit Report, My Reports, My Calls, Reminders, My Admissions
- **Call Stats Bar**: Shows consultant's Total Calls, Successful, Failed, Attempted
- **Clickable Call Stats**: Click on any stat in My Calls tab to view detailed call list in modal
- **Auto-Logging of Successful Calls**: When a consultant submits a detailed Student Calling Report, it automatically logs as a successful call
- **Quick Log Call Feature**:
  - Quick call logging for FAILED or ATTEMPTED calls only
  - **Mandatory Contact Number**: Cannot log call without contact number
  - Optional fields: Student Name, Remarks
  - Two quick actions: Failed, Attempted (Success is auto-logged via report submission)
  - Note displayed explaining successful calls are automatically logged when submitting detailed reports
- **Daily Report Submission**: 
  - Full detailed student calling reports (auto-logs as successful call)
  - **Mandatory Fields**: Student Name, Contact Number, Institution Name, Competitive Exam Preference, Career Interest, Interest Scope (marked with red asterisks)
  - **Validation Warnings**: Warning messages displayed if mandatory fields are missing
  - **Next Calling Reminder**: Optional calendar input to set follow-up reminder date
  - **Duplicate Report Handling**: When submitting with existing phone number, shows confirmation modal to update/replace old report
- **Bulk Report Upload**:
  - Download Sample CSV with correct format
  - Upload CSV to submit multiple reports at once
  - Auto-validation of required fields
  - Auto-logs successful calls for each uploaded report
- **Reminders Tab**: View own follow-up reminders categorized as Overdue, Today, Upcoming with "Followed Up" action
- **My Reports Tab**: View own submitted reports with date filter
- **My Calls Tab**: View call statistics breakdown with clickable detailed view
- **My Admissions Tab**: View admissions credited by admin with payout summary
- **Mobile-Responsive**: Full smartphone compatibility with horizontally scrollable tabs

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI, React Context (Theme)
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB

## API Endpoints

### Call Logging
- `POST /api/consultant/calls` - Log a call (mandatory contact number for failed/attempted)
- `GET /api/consultant/calls/{consultant_id}` - Get consultant's call stats
- `GET /api/consultant/calls/details/{consultant_id}` - Get detailed call list with optional type filter
- `GET /api/admin/calls` - Get all call stats with per-consultant breakdown
- `GET /api/admin/calls/details` - Get detailed call list for admin (filter by consultant/type)

### Reminders
- `GET /api/consultant/reminders/{consultant_id}` - Get consultant's follow-up reminders
- `GET /api/admin/reminders` - Get all reminders (admin view)
- `PUT /api/consultant/reminders/{report_id}/complete` - Mark reminder as complete

### Bulk Operations
- `POST /api/admin/bulk-delete` - Bulk delete with password verification
- `POST /api/admin/verify-password` - Verify admin password
- `GET /api/consultant/sample-csv` - Download sample CSV format
- `POST /api/consultant/bulk-reports` - Upload bulk reports from CSV data

### Student Queries
- `GET /api/queries` - Fetch all student queries
- `POST /api/queries` - Submit new query
- `PATCH /api/queries/{query_id}/status` - Update query status
- `DELETE /api/queries/{query_id}` - Delete query

### Consultant Reports
- `POST /api/consultant/login` - Authenticate consultant
- `POST /api/consultant/reports` - Submit consultant report (with duplicate handling)
- `GET /api/consultant/reports/check-duplicate` - Check if report exists for phone number
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
- **consultant_reports**: `{consultant_name, consultant_id, student_name, contact_number, institution_name, interest_scope, next_followup_date, followup_completed, ...}`
- **call_logs**: `{id, consultant_id, consultant_name, call_type, student_name, contact_number, remarks, created_at}`
- **admissions**: `{id, student_name, course, college, admission_date, consultant_id, consultant_name, payout_amount, payout_status, created_at}`

---

## Implementation Status

### ✅ Completed (March 2, 2026)
- Full-stack application with React + FastAPI + MongoDB
- **Mobile-Responsive Design** - All pages fully smartphone compatible
- **Interactive Login Backgrounds** - Floating animated icons on Admin and Consultant login pages
- **Call Logging System** - Quick log calls (failed/attempted) with mandatory contact number
- **Call Stats for Admin** - View all consultants' call statistics with success rates (clickable for details)
- **Call Stats for Consultants** - View own call statistics with detailed list modal
- **Bulk Delete with Password Verification** - Delete data by type, consultant, date range
- **Duplicate Report Handling** - Confirmation modal when submitting report with existing phone number
- **Mandatory Field Validation** - Red asterisk marking, warning messages on form submission
- **Next Calling Reminder** - Calendar input for follow-up dates with Reminders tab
- **Bulk CSV Upload** - Download sample and upload multiple reports at once
- **Reminders Management** - Admin and Consultant view of overdue/today/upcoming reminders
- Landing page with all sections including Success Gallery
- GET COUNSELLING NOW button
- Student query submission system
- Admin dashboard with 6-tab interface
- Admissions Tracking System
- Consultant Management
- Consultant portal with 5-tab interface
- Daily report submission
- Route protection
- Calendar Date Filters
- CSV export functionality

### 🔄 Pending/Backlog
- **Future**: JWT-based authentication
- **Future**: Move consultant credentials to database
- **Future**: Email notifications
- **Future**: SMS notifications for reminders

---

## Credentials Reference

### Admin
- URL: `/admin`
- User ID: `ADMIN`
- Password: `EDUadvisors@souvikCEO2026`

### Consultants (25 total)
- PRIYAMPATRA / Priyam123!@#
- AK007 / 7001377649
- (See `/app/backend/consultants.py` for full list)
