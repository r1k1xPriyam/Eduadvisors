# Edu Advisor - Product Requirements Document

## Overview
Edu Advisor is a comprehensive educational consultancy website with a React frontend, FastAPI backend, and MongoDB database.

## Core Features

### Public Website
- **Landing Page**: Multi-section page with Hero, About, Services, Courses, Colleges, Testimonials, FAQ, and Contact sections
- **Course/College Modals**: Clickable courses and colleges showing detailed information
- **Contact Form**: Students can submit queries which are saved to the database

### Admin Dashboard (`/admin`)
- **Secure Login**: ID: `ADMIN`, Password: `Eduadvisors@2026`
- **Student Queries Management**: View, search, filter, and update query status (New → Contacted → Closed)
- **Consultant Reports**: View all daily reports submitted by consultants, grouped by consultant name
- **Export to CSV**: Export queries and reports
- **IST Timestamps**: All times displayed in Indian Standard Time

### Consultant Portal (`/consultant`)
- **Unique Logins**: 25 consultants with individual credentials
- **Daily Report Submission**: Consultants submit student calling reports
- **My Reports Tab**: Each consultant can view their own submitted reports with date/time (IST)
- **Report Statistics**: Total reports, Today's count, This Week's count
- **Report Detail Modal**: View full details of any submitted report
- **Protected Routes**: Only authenticated consultants can access

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI
- **Backend**: FastAPI, Motor (async MongoDB driver)
- **Database**: MongoDB

## API Endpoints
- `GET /api/queries` - Fetch all student queries
- `PATCH /api/queries/{query_id}/status` - Update query status
- `POST /api/consultant/login` - Authenticate consultant
- `POST /api/consultant/reports` - Submit consultant report
- `GET /api/consultant/reports/{consultant_id}` - Fetch reports for specific consultant
- `GET /api/admin/consultant-reports` - Fetch all consultant reports

## Database Schema
- **student_queries**: `{name, phone, email, course_of_interest, message, current_institution, status, timestamp}`
- **consultant_reports**: `{consultant_name, consultant_id, student_name, contact_number, institution_name, interest_scope, ...}`

---

## Implementation Status

### ✅ Completed (Jan 29, 2026)
- Full-stack application with React + FastAPI + MongoDB
- Landing page with all sections
- Student query submission system
- Admin dashboard with login
- Consultant portal with 25 unique logins (+ SOYALI_EDU added)
- Daily report submission for consultants
- **NEW: "My Reports" tab for consultants** - Each consultant can view their own reports with:
  - Stats cards (Total, Today, This Week)
  - Reports table with Date/Time (IST), Student Name, Contact, Institution, Interest Scope
  - View button to see full report details in modal
  - Refresh button to reload reports
- Admin view of consultant reports (grouped by consultant)
- Route protection for admin and consultant dashboards
- IST timestamp formatting
- CSV export functionality
- "Made with Emergent" watermark removed
- Loader text changed to "EDUADVISOR"

### 🔄 Pending/Backlog
- **P3**: Logo Update - Convert user's PDF logo to web format and implement
- **Future**: JWT-based authentication (currently using localStorage)
- **Future**: Move consultant credentials from hardcoded file to database

---

## Credentials Reference

### Admin
- URL: `/admin`
- User ID: `ADMIN`
- Password: `Eduadvisors@2026`

### Consultants (25 total)
- PRIYAMPATRA / Priyam123!@#
- AK007 / 7001377649
- NILKANTHA / nil12345
- SWARAJ_EDU / Swaraj@5533
- SOYALI_EDU / Soyali2026@ (newly added)
- (See `/app/backend/consultants.py` for full list)
