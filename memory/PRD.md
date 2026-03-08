# Edu Advisor - Product Requirements Document

## Original Problem Statement
Build a comprehensive website for an educational consultancy, "Edu Advisor". Started as a landing page and evolved into a full-stack application with React frontend, FastAPI backend, and MongoDB database.

## Core Features

### 1. Public Website
- Multi-section landing page with student query form
- "GET COUNSELLING NOW" button
- Light/dark mode support

### 2. Login Portals
- Secure login for "Admin" and "Consultant" roles
- localStorage-based session management (JWT upgrade planned)

### 3. Admin Dashboard (7 tabs)
- **Student Queries**: View all student queries
- **Consultant Reports**: View all reports from consultants
- **Call Stats**: View detailed call statistics per consultant (click-through)
- **Admissions**: View all admissions
- **Manage Consultants**: Full CRUD - add, edit, delete consultants
- **Reminders**: View/delete all consultant reminders
- **Analytics**: 5 charts - Call Distribution Pie, Interest Scope Pie, Reports Trend, Consultant Performance, Monthly Admissions
- Bulk delete with filters and password confirmation

### 4. Consultant Portal (6 tabs)
- **Submit Report**: Detailed student calling report form with mandatory field validation
  - Duplicate report handling (phone number match → overwrite with confirmation)
  - **Bulk Report Entry** (2 modes):
    - **In-App Spreadsheet**: Interactive editable table with add/remove rows, inline validation, submit all
    - **CSV Upload**: Download sample CSV, upload with papaparse parsing, preview & confirm
- **My Reports**: View own submitted reports
- **My Calls**: View call statistics (summary + detailed modal)
  - Quick Call Logging for Failed/Attempted calls
- **Reminders**: Upcoming/overdue/today reminders, mark as followed-up or ignore
  - Login notification popup for due reminders
- **My Admissions**: View own admissions
- **Analytics**: 4 charts - Call Distribution Pie, Interest Scope Pie, Reports Trend (14 days), Daily Call Breakdown (14 days) + overview cards

## Tech Stack
- **Frontend**: React, React Router, TailwindCSS, Shadcn UI, recharts, papaparse
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic
- **Database**: MongoDB

## Key DB Collections
- `consultants`: {user_id, name, password}
- `consultant_reports`: {student_name, contact_number, institution_name, competitive_exam_preference, career_interest, college_interest, interest_scope, next_followup_date, other_remarks, consultant_id, consultant_name, created_at}
- `call_logs`: {consultant_id, consultant_name, student_name, contact_number, call_type, remarks, created_at}
- `admissions`: {consultant_id, ...}
- `reminders`: {consultant_id, student_name, contact_number, next_followup_date, ignored, ...}
- `student_queries`: {name, email, phone, message, ...}

## Credentials
- **Admin**: ADMIN / EDUadvisors@souvikCEO2026
- **Consultant**: PRIYAMPATRA / Priyam123!@#

## What's Been Implemented (All Tested & Verified)
- [x] Public landing page with dark/light mode
- [x] Admin & Consultant login portals
- [x] Admin Dashboard with all 7 tabs including Analytics
- [x] Consultant Dashboard with all 6 tabs including Analytics
- [x] Consultant CRUD (admin can add/edit/delete)
- [x] Duplicate report handling with confirmation
- [x] Mandatory field validation
- [x] Quick call logging
- [x] Full reminder system with notifications
- [x] Bulk report entry: In-App Spreadsheet + CSV Upload (papaparse)
- [x] Admin Analytics: 5 charts with backend endpoints
- [x] Consultant Analytics: 4 charts with backend endpoints
- [x] Bulk delete with filters

## Backlog (Prioritized)
- **P1**: Refactor large dashboard components into smaller files
- **P1**: Upgrade to JWT-based authentication
- **P2**: Dark theme full audit for visibility consistency
