# Edu Advisor - Product Requirements Document

## Overview
Edu Advisor is a comprehensive educational consultancy website with a React frontend, FastAPI backend, and MongoDB database. Fully mobile-responsive design with light/dark theme support.

## Core Features

### Public Website
- **Landing Page**: Multi-section page with Hero, About, Services, Courses, Colleges, Testimonials, Success Gallery, FAQ, and Contact sections
- **GET COUNSELLING NOW Button**: Prominent CTA button in Hero section that opens the student query popup
- **Success Gallery**: Interactive carousel showcasing student success stories
- **Contact Form**: Students can submit queries which are saved to the database
- **Light/Dark Theme**: Full dark mode support across all pages

### Admin Dashboard (`/admin`)
- **Secure Login**: ID: `ADMIN`, Password: `EDUadvisors@souvikCEO2026`
- **6 Tab Interface**: Student Queries, Consultant Reports, Call Stats, Admissions, Manage Consultants, Reminders
- **Call Statistics by Consultant**: Table showing each consultant's call breakdown with **clickable stats** to view detailed call list
- **Reminders Tab**: View all consultant follow-up reminders (Overdue, Today, Upcoming) with **Delete** action
- **Consultant Management**: 
  - **Permanently stored in MongoDB** - All changes persist across restarts
  - Add new consultants with User ID, Name, Password
  - Edit **all fields** (User ID, Name, Password)
  - Delete consultants permanently
- **Reports Visibility**: View all consultant reports with search and filter options
- **Bulk Delete Feature**: Delete data by type with password confirmation

### Consultant Portal (`/consultant`)
- **Unique Logins**: 24 consultants with individual credentials (stored permanently in MongoDB)
- **5 Tab Interface**: Submit Report, My Reports, My Calls, Reminders, My Admissions
- **Notification Popup on Login**: When consultant logs in, shows popup for today's/overdue reminders
- **Reminder Actions**: 
  - **"Already Followed Up"** - Marks reminder as complete, prompts for new report
  - **"Ignore"** - Dismisses reminder permanently
  - Status syncs between Admin and Consultant panels
- **Call Stats**: Clickable stats showing detailed call list
- **Quick Log Call**: Mandatory contact number for failed/attempted calls
- **Report Submission**: 
  - Mandatory fields validation with warnings
  - Duplicate report handling (overwrites old)
  - Next Calling Reminder calendar input
- **Bulk CSV Upload**: Download sample, upload multiple reports
- **My Reports Tab**: View own submitted reports (normal and bulk)

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI, React Context (Theme)
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB
- **Collections**: consultants, consultant_reports, call_logs, student_queries, admissions

## API Endpoints

### Consultant Management (Permanent Storage)
- `GET /api/admin/consultants` - Get all consultants from MongoDB
- `POST /api/admin/consultants` - Add new consultant (persists to DB)
- `PUT /api/admin/consultants/{user_id}` - Update consultant (Name, User ID, Password)
- `DELETE /api/admin/consultants/{user_id}` - Delete consultant permanently

### Reminders
- `GET /api/consultant/reminders/{consultant_id}` - Get consultant's follow-up reminders
- `GET /api/admin/reminders` - Get all reminders (admin view)
- `PUT /api/consultant/reminders/{report_id}/complete` - Mark as "Already Followed Up"
- `PUT /api/consultant/reminders/{report_id}/ignore` - Mark as "Ignored"
- `DELETE /api/admin/reminders/{report_id}` - Admin delete reminder

### Call Logging
- `POST /api/consultant/calls` - Log call (mandatory contact for failed/attempted)
- `GET /api/consultant/calls/details/{consultant_id}` - Get detailed call list
- `GET /api/admin/calls/details` - Admin view of detailed calls

### Reports
- `POST /api/consultant/reports` - Submit report (handles duplicates)
- `GET /api/consultant/reports/{consultant_id}` - Consultant's own reports
- `GET /api/admin/consultant-reports` - All reports for admin
- `POST /api/consultant/bulk-reports` - Bulk CSV upload

---

## Implementation Status

### ✅ Completed (March 2, 2026)
- Full-stack application with React + FastAPI + MongoDB
- **Mobile-Responsive Design** - All pages fully smartphone compatible
- **Consultant Credentials in MongoDB** - Permanently stored, all CRUD operations persist
- **Reminder System Enhanced**:
  - Notification popup on consultant login
  - "Already Followed Up" and "Ignore" options
  - Admin can delete reminders
  - Status synced between panels
- **Reports Visibility** - Both bulk and normal reports visible in Admin and Consultant panels
- **Dark Theme Fixes** - All text and inputs readable in dark mode
- Call logging with mandatory contact number
- Detailed call stats view (clickable)
- Duplicate report handling
- Mandatory field validation
- CSV bulk upload
- All previous features preserved

### ✅ Verified by Testing Agent
- 18/18 backend API tests passed (100%)
- Frontend UI 100% verified via Playwright
- MongoDB persistence confirmed for consultants collection

---

## Credentials Reference

### Admin
- URL: `/admin`
- User ID: `ADMIN`
- Password: `EDUadvisors@souvikCEO2026`

### Consultants (24 total - stored in MongoDB)
- PRIYAMPATRA / Priyam123!@#
- AK007 / 7001377649
- (See MongoDB 'consultants' collection for full list)
