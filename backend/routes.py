from fastapi import APIRouter, HTTPException
from models import StudentQuery, StudentQueryCreate, College, Course, ConsultantReport, ConsultantReportCreate
from typing import List
import logging
from datetime import datetime
from consultants import verify_consultant, get_consultant_name

logger = logging.getLogger(__name__)

router = APIRouter()

# Import db from database module
from database import db

# Student Query Endpoints
@router.post("/queries", response_model=dict)
async def create_query(query_data: StudentQueryCreate):
    try:
        query_dict = query_data.dict()
        query_obj = StudentQuery(**query_dict)
        
        # Insert into database
        result = await db.student_queries.insert_one(query_obj.dict())
        
        logger.info(f"Query created successfully: {query_obj.id}")
        
        return {
            "success": True,
            "message": "Query submitted successfully! We'll contact you soon.",
            "query_id": query_obj.id
        }
    except Exception as e:
        logger.error(f"Error creating query: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit query")

@router.get("/queries", response_model=dict)
async def get_all_queries():
    try:
        queries = await db.student_queries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
        return {
            "success": True,
            "queries": queries,
            "count": len(queries)
        }
    except Exception as e:
        logger.error(f"Error fetching queries: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch queries")

@router.get("/queries/{query_id}", response_model=dict)
async def get_query(query_id: str):
    try:
        query = await db.student_queries.find_one({"id": query_id}, {"_id": 0})
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        return {
            "success": True,
            "query": query
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching query: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch query")

# Update query status
@router.patch("/queries/{query_id}/status", response_model=dict)
async def update_query_status(query_id: str, status: str):
    try:
        # Validate status
        valid_statuses = ["new", "contacted", "closed"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        
        # Update the query
        result = await db.student_queries.update_one(
            {"id": query_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Query not found")
        
        logger.info(f"Query {query_id} status updated to {status}")
        
        return {
            "success": True,
            "message": f"Query status updated to {status}",
            "query_id": query_id,
            "new_status": status
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating query status: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update query status")

# Consultant Authentication
@router.post("/consultant/login", response_model=dict)
async def consultant_login(user_id: str, password: str):
    try:
        result = verify_consultant(user_id, password)
        if result["success"]:
            logger.info(f"Consultant {user_id} logged in successfully")
            return result
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during consultant login: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")

# Consultant Report Endpoints
@router.post("/consultant/reports", response_model=dict)
async def create_consultant_report(report_data: ConsultantReportCreate, consultant_id: str):
    try:
        # Verify consultant
        consultant_name = get_consultant_name(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Create report
        report_dict = report_data.dict()
        report_dict["consultant_id"] = consultant_id
        report_dict["consultant_name"] = consultant_name
        report_obj = ConsultantReport(**report_dict)
        
        # Insert into database
        result = await db.consultant_reports.insert_one(report_obj.dict())
        
        logger.info(f"Consultant report created by {consultant_name}: {report_obj.id}")
        
        return {
            "success": True,
            "message": "Report submitted successfully",
            "report_id": report_obj.id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating consultant report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit report")

@router.get("/consultant/reports/{consultant_id}", response_model=dict)
async def get_consultant_reports(consultant_id: str):
    try:
        # Verify consultant exists
        consultant_name = get_consultant_name(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Fetch reports for this consultant only
        reports = await db.consultant_reports.find(
            {"consultant_id": consultant_id}, 
            {"_id": 0}
        ).sort("created_at", -1).to_list(1000)
        
        return {
            "success": True,
            "consultant_name": consultant_name,
            "reports": reports,
            "count": len(reports)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant reports: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports")

# Admin: Get all consultant reports
@router.get("/admin/consultant-reports", response_model=dict)
async def get_all_consultant_reports():
    try:
        reports = await db.consultant_reports.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
        
        # Group by consultant
        reports_by_consultant = {}
        for report in reports:
            consultant_name = report.get("consultant_name", "Unknown")
            if consultant_name not in reports_by_consultant:
                reports_by_consultant[consultant_name] = []
            reports_by_consultant[consultant_name].append(report)
        
        return {
            "success": True,
            "reports": reports,
            "reports_by_consultant": reports_by_consultant,
            "total_count": len(reports)
        }
    except Exception as e:
        logger.error(f"Error fetching all consultant reports: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch consultant reports")

# College Endpoints
@router.get("/colleges", response_model=dict)
async def get_all_colleges():
    try:
        colleges = await db.colleges.find({}, {"_id": 0}).to_list(1000)
        return {
            "success": True,
            "colleges": colleges,
            "count": len(colleges)
        }
    except Exception as e:
        logger.error(f"Error fetching colleges: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch colleges")

@router.get("/colleges/{college_id}", response_model=dict)
async def get_college(college_id: str):
    try:
        college = await db.colleges.find_one({"id": college_id}, {"_id": 0})
        if not college:
            raise HTTPException(status_code=404, detail="College not found")
        
        return {
            "success": True,
            "college": college
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching college: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch college")

# Course Endpoints
@router.get("/courses", response_model=dict)
async def get_all_courses():
    try:
        courses = await db.courses.find({}, {"_id": 0}).to_list(1000)
        return {
            "success": True,
            "courses": courses,
            "count": len(courses)
        }
    except Exception as e:
        logger.error(f"Error fetching courses: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch courses")

@router.get("/courses/{course_id}", response_model=dict)
async def get_course(course_id: str):
    try:
        # Try to find by id or name
        course = await db.courses.find_one({
            "$or": [
                {"id": course_id},
                {"name": {"$regex": f"^{course_id}$", "$options": "i"}}
            ]
        }, {"_id": 0})
        
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        
        return {
            "success": True,
            "course": course
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching course: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch course")