# API Contracts & Integration Plan - Edu Advisor

## Overview
This document defines the contracts between frontend and backend for the Edu Advisor educational consultancy website.

## Backend Implementation Plan

### 1. Database Models

#### StudentQuery Model
```python
{
    "_id": ObjectId,
    "name": str,
    "phone": str,
    "email": str,
    "course": str,
    "message": str,
    "status": str,  # "new", "contacted", "closed"
    "created_at": datetime,
    "updated_at": datetime
}
```

#### College Model (for detailed information)
```python
{
    "_id": ObjectId,
    "name": str,
    "description": str,
    "website": str,
    "nirf_rank": int,
    "naac_grade": str,
    "location": str,
    "established_year": int,
    "specializations": [str],
    "placement_stats": {
        "average_package": str,
        "highest_package": str,
        "placement_rate": str
    },
    "facilities": [str],
    "top_recruiters": [str]
}
```

#### Course Model (with college recommendations)
```python
{
    "_id": ObjectId,
    "name": str,
    "full_name": str,
    "type": str,  # "undergraduate" or "postgraduate"
    "duration": str,
    "description": str,
    "career_prospects": [str],
    "why_choose": str,
    "colleges_offering": [
        {
            "college_name": str,
            "college_id": str,
            "average_placement": str,
            "top_companies": [str],
            "specialization": str,
            "why_recommended": str
        }
    ]
}
```

### 2. API Endpoints

#### POST /api/queries - Submit Student Query
**Request:**
```json
{
    "name": "string",
    "phone": "string",
    "email": "string",
    "course": "string",
    "message": "string"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Query submitted successfully",
    "query_id": "string"
}
```

#### GET /api/colleges - Get All Colleges
**Response:**
```json
{
    "success": true,
    "colleges": [...]
}
```

#### GET /api/colleges/{college_id} - Get College Details
**Response:**
```json
{
    "success": true,
    "college": {...}
}
```

#### GET /api/courses - Get All Courses
**Response:**
```json
{
    "success": true,
    "courses": [...]
}
```

#### GET /api/courses/{course_name} - Get Course Details with College Recommendations
**Response:**
```json
{
    "success": true,
    "course": {...}
}
```

## Frontend Changes

### Mock Data Removal
- Remove mock query submission from Contact.jsx
- Remove static data from mockData.js (keep as fallback)

### Integration Points

1. **Contact Form (Contact.jsx)**
   - Replace mock submission with API call to POST /api/queries
   - Handle success/error responses with toast notifications

2. **Colleges Section (Colleges.jsx)**
   - Make college names clickable
   - Open modal/dialog with detailed college information
   - Fetch data from GET /api/colleges/{college_id}

3. **Courses Section (Courses.jsx)**
   - Make course cards clickable
   - Open modal/dialog with course details and college recommendations
   - Fetch data from GET /api/courses/{course_name}
   - Show placement statistics and why to opt for the course

## Implementation Steps

1. ✅ Create contracts.md
2. Enhance mockData.js with detailed college and course information
3. Create modal components for College and Course details
4. Update frontend components to be clickable and show modals
5. Implement backend models and API endpoints
6. Integrate frontend with backend APIs
7. Test complete flow

## Notes
- Form validation on both frontend and backend
- Error handling for API failures
- Loading states during API calls
- Seed database with college and course information
