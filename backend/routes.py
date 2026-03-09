from fastapi import APIRouter, HTTPException, Body
from models import StudentQuery, StudentQueryCreate, College, Course, ConsultantReport, ConsultantReportCreate
from typing import List
import logging
import uuid
from datetime import datetime, timezone
from consultants import (
    verify_consultant, get_consultant_name, get_all_consultants, 
    add_consultant, update_consultant, delete_consultant,
    verify_consultant_async, get_consultant_name_async, get_all_consultants_async,
    add_consultant_async, update_consultant_async, delete_consultant_async,
    init_consultants_db
)

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

# Delete Student Query (Admin only)
@router.delete("/queries/{query_id}", response_model=dict)
async def delete_query(query_id: str):
    try:
        result = await db.student_queries.delete_one({"id": query_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Query not found")
        
        logger.info(f"Query {query_id} deleted successfully")
        
        return {
            "success": True,
            "message": "Query deleted successfully",
            "query_id": query_id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting query: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete query")

# Consultant Authentication
@router.post("/consultant/login", response_model=dict)
async def consultant_login(user_id: str, password: str):
    try:
        result = await verify_consultant_async(user_id, password)
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
async def create_consultant_report(report_data: ConsultantReportCreate, consultant_id: str, update_existing: bool = False):
    try:
        # Verify consultant
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Check for duplicate report with same phone number for this consultant
        existing_report = await db.consultant_reports.find_one({
            "consultant_id": consultant_id,
            "contact_number": report_data.contact_number
        })
        
        if existing_report and not update_existing:
            # Return info about existing report for confirmation
            return {
                "success": False,
                "duplicate": True,
                "message": f"A report for this phone number already exists (Student: {existing_report.get('student_name', 'Unknown')}). Do you want to update it?",
                "existing_report_id": existing_report.get("id")
            }
        
        if existing_report and update_existing:
            # Delete the old report and its associated call log
            await db.consultant_reports.delete_one({"id": existing_report.get("id")})
            # Also update the call log - mark old one as updated
            await db.call_logs.delete_many({
                "consultant_id": consultant_id,
                "contact_number": report_data.contact_number,
                "call_type": "successful"
            })
            logger.info(f"Deleted existing report for phone {report_data.contact_number}")
        
        # Create report
        report_dict = report_data.dict()
        report_dict["consultant_id"] = consultant_id
        report_dict["consultant_name"] = consultant_name
        report_dict["followup_completed"] = False
        report_obj = ConsultantReport(**report_dict)
        
        # Insert into database
        result = await db.consultant_reports.insert_one(report_obj.dict())
        
        # Auto-log as a successful call when a detailed report is submitted
        call_log = {
            "id": str(uuid.uuid4()),
            "consultant_id": consultant_id,
            "consultant_name": consultant_name,
            "student_name": report_data.student_name,
            "contact_number": report_data.contact_number,
            "call_type": "successful",
            "remarks": f"Detailed report submitted - {report_data.career_interest or 'General counselling'}",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.call_logs.insert_one(call_log)
        
        action = "updated" if (existing_report and update_existing) else "created"
        logger.info(f"Consultant report {action} by {consultant_name}: {report_obj.id}")
        
        return {
            "success": True,
            "message": f"Report {action} successfully",
            "report_id": report_obj.id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating consultant report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit report")

# Check for duplicate report
@router.get("/consultant/reports/check-duplicate", response_model=dict)
async def check_duplicate_report(consultant_id: str, contact_number: str):
    try:
        existing_report = await db.consultant_reports.find_one({
            "consultant_id": consultant_id,
            "contact_number": contact_number
        })
        
        if existing_report:
            return {
                "exists": True,
                "student_name": existing_report.get("student_name"),
                "report_id": existing_report.get("id"),
                "created_at": existing_report.get("created_at")
            }
        return {"exists": False}
    except Exception as e:
        logger.error(f"Error checking duplicate: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to check duplicate")

@router.get("/consultant/reports/{consultant_id}", response_model=dict)
async def get_consultant_reports(consultant_id: str):
    try:
        # Verify consultant exists
        consultant_name = await get_consultant_name_async(consultant_id)
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

# Delete Consultant Report (Admin only)
@router.delete("/consultant/reports/{report_id}", response_model=dict)
async def delete_consultant_report(report_id: str):
    try:
        result = await db.consultant_reports.delete_one({"id": report_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        logger.info(f"Consultant report {report_id} deleted successfully")
        
        return {
            "success": True,
            "message": "Report deleted successfully",
            "report_id": report_id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting consultant report: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete report")

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

# ==================== Consultant Management (Admin) ====================

@router.get("/admin/consultants", response_model=dict)
async def get_consultants():
    """Get all consultants for admin management"""
    try:
        consultants = await get_all_consultants_async()
        return {
            "success": True,
            "consultants": consultants,
            "count": len(consultants)
        }
    except Exception as e:
        logger.error(f"Error fetching consultants: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch consultants")

@router.post("/admin/consultants", response_model=dict)
async def create_consultant(user_id: str, name: str, password: str):
    """Add a new consultant - permanently stored in database"""
    try:
        result = await add_consultant_async(user_id, name, password)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        logger.info(f"Consultant {user_id} added permanently to database")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding consultant: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add consultant")

@router.put("/admin/consultants/{user_id}", response_model=dict)
async def modify_consultant(user_id: str, new_user_id: str = None, password: str = None, name: str = None):
    """Update consultant details - User ID, Password, and Name can be modified"""
    try:
        result = await update_consultant_async(user_id, new_user_id, password, name)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        logger.info(f"Consultant {user_id} updated in database")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating consultant: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update consultant")

@router.delete("/admin/consultants/{user_id}", response_model=dict)
async def remove_consultant(user_id: str):
    """Delete a consultant - permanently removed from database"""
    try:
        result = await delete_consultant_async(user_id)
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
        logger.info(f"Consultant {user_id} permanently deleted from database")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting consultant: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete consultant")


# ==================== Student Admissions Tracking ====================

@router.post("/admin/admissions", response_model=dict)
async def create_admission(
    student_name: str,
    course: str,
    college: str,
    admission_date: str,
    consultant_id: str,
    consultant_name: str,
    payout_amount: float,
    payout_status: str = "PAYOUT NOT CREDITED YET"
):
    """Record a new student admission"""
    try:
        from datetime import datetime
        import uuid
        
        admission = {
            "id": str(uuid.uuid4()),
            "student_name": student_name,
            "course": course,
            "college": college,
            "admission_date": admission_date,
            "consultant_id": consultant_id,
            "consultant_name": consultant_name,
            "payout_amount": payout_amount,
            "payout_status": payout_status,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await db.admissions.insert_one(admission)
        logger.info(f"Admission recorded for student {student_name} by consultant {consultant_name}")
        
        return {
            "success": True,
            "message": "Admission recorded successfully",
            "admission_id": admission["id"]
        }
    except Exception as e:
        logger.error(f"Error creating admission: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to record admission")

@router.get("/admin/admissions", response_model=dict)
async def get_all_admissions():
    """Get all student admissions for admin"""
    try:
        admissions = await db.admissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
        return {
            "success": True,
            "admissions": admissions,
            "count": len(admissions)
        }
    except Exception as e:
        logger.error(f"Error fetching admissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admissions")

@router.put("/admin/admissions/{admission_id}", response_model=dict)
async def update_admission(
    admission_id: str,
    student_name: str = None,
    course: str = None,
    college: str = None,
    admission_date: str = None,
    payout_amount: float = None,
    payout_status: str = None
):
    """Update an admission record"""
    try:
        from datetime import datetime
        
        update_data = {"updated_at": datetime.utcnow()}
        if student_name:
            update_data["student_name"] = student_name
        if course:
            update_data["course"] = course
        if college:
            update_data["college"] = college
        if admission_date:
            update_data["admission_date"] = admission_date
        if payout_amount is not None:
            update_data["payout_amount"] = payout_amount
        if payout_status:
            update_data["payout_status"] = payout_status
        
        result = await db.admissions.update_one(
            {"id": admission_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Admission not found")
        
        logger.info(f"Admission {admission_id} updated")
        return {"success": True, "message": "Admission updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating admission: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update admission")

@router.delete("/admin/admissions/{admission_id}", response_model=dict)
async def delete_admission(admission_id: str):
    """Delete an admission record"""
    try:
        result = await db.admissions.delete_one({"id": admission_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Admission not found")
        
        logger.info(f"Admission {admission_id} deleted")
        return {"success": True, "message": "Admission deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting admission: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete admission")

@router.get("/consultant/admissions/{consultant_id}", response_model=dict)
async def get_consultant_admissions(consultant_id: str):
    """Get admissions for a specific consultant"""
    try:
        admissions = await db.admissions.find(
            {"consultant_id": consultant_id}, 
            {"_id": 0}
        ).sort("created_at", -1).to_list(10000)
        
        return {
            "success": True,
            "admissions": admissions,
            "count": len(admissions)
        }
    except Exception as e:
        logger.error(f"Error fetching consultant admissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admissions")


# ============ CALL LOGGING ENDPOINTS ============

@router.post("/consultant/calls", response_model=dict)
async def log_call(
    consultant_id: str,
    call_type: str = "attempted",  # attempted, successful, failed
    student_name: str = None,
    contact_number: str = None,
    remarks: str = None
):
    """Log a call - contact_number is mandatory for failed/attempted calls"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Validate contact_number is mandatory for quick log (failed/attempted)
        if call_type in ["failed", "attempted"]:
            if not contact_number or contact_number.strip() == "" or contact_number == "N/A":
                raise HTTPException(status_code=400, detail="Contact number is mandatory for quick call logging")
        
        call_log = {
            "id": f"call_{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S%f')}_{consultant_id}",
            "consultant_id": consultant_id,
            "consultant_name": consultant_name,
            "call_type": call_type,
            "student_name": student_name.strip() if student_name else "N/A",
            "contact_number": contact_number.strip() if contact_number else "N/A",
            "remarks": remarks.strip() if remarks else "",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.call_logs.insert_one(call_log)
        
        logger.info(f"Call logged by {consultant_name}: {call_type}")
        return {"success": True, "message": "Call logged successfully", "call_id": call_log["id"]}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging call: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to log call")

@router.get("/consultant/calls/{consultant_id}", response_model=dict)
async def get_consultant_calls(consultant_id: str):
    """Get call stats for a specific consultant"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        calls = await db.call_logs.find(
            {"consultant_id": consultant_id}, 
            {"_id": 0}
        ).sort("created_at", -1).to_list(10000)
        
        # Calculate stats
        total_calls = len(calls)
        successful_calls = len([c for c in calls if c.get("call_type") == "successful"])
        failed_calls = len([c for c in calls if c.get("call_type") == "failed"])
        attempted_calls = len([c for c in calls if c.get("call_type") == "attempted"])
        
        return {
            "success": True,
            "consultant_name": consultant_name,
            "calls": calls,
            "stats": {
                "total_calls": total_calls,
                "successful_calls": successful_calls,
                "failed_calls": failed_calls,
                "attempted_calls": attempted_calls
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant calls: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch calls")

@router.get("/admin/calls", response_model=dict)
async def get_all_calls():
    """Get all call stats for admin view"""
    try:
        calls = await db.call_logs.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
        
        # Group by consultant
        consultant_stats = {}
        for call in calls:
            cid = call.get("consultant_id")
            if cid not in consultant_stats:
                consultant_stats[cid] = {
                    "consultant_name": call.get("consultant_name"),
                    "total_calls": 0,
                    "successful_calls": 0,
                    "failed_calls": 0,
                    "attempted_calls": 0
                }
            consultant_stats[cid]["total_calls"] += 1
            call_type = call.get("call_type", "attempted")
            if call_type == "successful":
                consultant_stats[cid]["successful_calls"] += 1
            elif call_type == "failed":
                consultant_stats[cid]["failed_calls"] += 1
            else:
                consultant_stats[cid]["attempted_calls"] += 1
        
        total_calls = len(calls)
        total_successful = len([c for c in calls if c.get("call_type") == "successful"])
        total_failed = len([c for c in calls if c.get("call_type") == "failed"])
        
        return {
            "success": True,
            "calls": calls,
            "consultant_stats": consultant_stats,
            "overall_stats": {
                "total_calls": total_calls,
                "successful_calls": total_successful,
                "failed_calls": total_failed,
                "attempted_calls": total_calls - total_successful - total_failed
            }
        }
    except Exception as e:
        logger.error(f"Error fetching all calls: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch calls")

# ============ ADMIN PASSWORD ============
ADMIN_PASSWORD = "EDUadvisors@souvikCEO2026"

# Delete call stats for a specific consultant (Admin only)
@router.delete("/admin/calls/{consultant_id}", response_model=dict)
async def delete_consultant_calls(consultant_id: str, password: str):
    """Delete all call logs for a specific consultant"""
    try:
        # Verify admin password
        if password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Invalid admin password")
        
        # Delete all calls for this consultant
        result = await db.call_logs.delete_many({"consultant_id": consultant_id})
        
        logger.info(f"Deleted {result.deleted_count} call logs for consultant {consultant_id}")
        
        return {
            "success": True,
            "message": f"Successfully deleted {result.deleted_count} call logs for consultant",
            "deleted_count": result.deleted_count
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting consultant calls: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete calls")

# ============ BULK DELETE ENDPOINTS (Admin) ============

@router.post("/admin/bulk-delete", response_model=dict)
async def bulk_delete_data(
    password: str,
    delete_type: str,  # reports, calls, queries, admissions, all
    consultant_id: str = None,
    start_date: str = None,
    end_date: str = None
):
    """Bulk delete data with password verification"""
    try:
        # Verify admin password
        if password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Invalid admin password")
        
        deleted_counts = {
            "reports": 0,
            "calls": 0,
            "queries": 0,
            "admissions": 0
        }
        
        # Build filter
        date_filter = {}
        if start_date:
            date_filter["$gte"] = start_date
        if end_date:
            date_filter["$lte"] = end_date + "T23:59:59"
        
        # Delete based on type
        collections_to_delete = []
        if delete_type == "reports" or delete_type == "all":
            collections_to_delete.append(("consultant_reports", "reports"))
        if delete_type == "calls" or delete_type == "all":
            collections_to_delete.append(("call_logs", "calls"))
        if delete_type == "queries" or delete_type == "all":
            collections_to_delete.append(("student_queries", "queries"))
        if delete_type == "admissions" or delete_type == "all":
            collections_to_delete.append(("admissions", "admissions"))
        
        for collection_name, key in collections_to_delete:
            collection = getattr(db, collection_name)
            query = {}
            
            if consultant_id and collection_name in ["consultant_reports", "call_logs", "admissions"]:
                query["consultant_id"] = consultant_id
            
            if date_filter and collection_name != "student_queries":
                query["created_at"] = date_filter
            elif date_filter and collection_name == "student_queries":
                query["timestamp"] = date_filter
            
            result = await collection.delete_many(query)
            deleted_counts[key] = result.deleted_count
        
        total_deleted = sum(deleted_counts.values())
        logger.info(f"Bulk delete performed: {deleted_counts}")
        
        return {
            "success": True,
            "message": f"Successfully deleted {total_deleted} records",
            "deleted_counts": deleted_counts
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in bulk delete: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to perform bulk delete")

@router.post("/admin/verify-password", response_model=dict)
async def verify_admin_password(password: str):
    """Verify admin password for sensitive operations"""
    if password == ADMIN_PASSWORD:
        return {"success": True, "message": "Password verified"}
    raise HTTPException(status_code=401, detail="Invalid password")


# ============ DETAILED CALL STATS ENDPOINTS ============

@router.get("/admin/calls/details", response_model=dict)
async def get_admin_call_details(consultant_id: str = None, call_type: str = None):
    """Get detailed call list for admin - filterable by consultant and call type"""
    try:
        query = {}
        if consultant_id:
            query["consultant_id"] = consultant_id
        if call_type:
            query["call_type"] = call_type
        
        calls = await db.call_logs.find(query, {"_id": 0}).sort("created_at", -1).to_list(10000)
        
        return {
            "success": True,
            "calls": calls,
            "count": len(calls)
        }
    except Exception as e:
        logger.error(f"Error fetching call details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call details")


@router.get("/consultant/calls/details/{consultant_id}", response_model=dict)
async def get_consultant_call_details(consultant_id: str, call_type: str = None):
    """Get detailed call list for a specific consultant"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        query = {"consultant_id": consultant_id}
        if call_type:
            query["call_type"] = call_type
        
        calls = await db.call_logs.find(query, {"_id": 0}).sort("created_at", -1).to_list(10000)
        
        return {
            "success": True,
            "consultant_name": consultant_name,
            "calls": calls,
            "count": len(calls)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant call details: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call details")


# ============ REMINDERS ENDPOINTS ============

@router.get("/consultant/reminders/{consultant_id}", response_model=dict)
async def get_consultant_reminders(consultant_id: str):
    """Get all upcoming follow-up reminders for a consultant"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        # Get today's date as ISO string for comparison
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        # Fetch reports with next_followup_date set
        reports = await db.consultant_reports.find(
            {
                "consultant_id": consultant_id,
                "next_followup_date": {"$nin": [None, ""]},
                "followup_completed": {"$ne": True}
            },
            {"_id": 0}
        ).sort("next_followup_date", 1).to_list(10000)
        
        # Categorize reminders
        today_reminders = []
        upcoming_reminders = []
        overdue_reminders = []
        
        for report in reports:
            followup_date = report.get("next_followup_date", "")
            if followup_date:
                if followup_date == today:
                    today_reminders.append(report)
                elif followup_date > today:
                    upcoming_reminders.append(report)
                else:
                    overdue_reminders.append(report)
        
        return {
            "success": True,
            "consultant_name": consultant_name,
            "today_reminders": today_reminders,
            "upcoming_reminders": upcoming_reminders,
            "overdue_reminders": overdue_reminders,
            "total_pending": len(today_reminders) + len(upcoming_reminders) + len(overdue_reminders)
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching reminders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reminders")


@router.get("/admin/reminders", response_model=dict)
async def get_all_reminders():
    """Get all upcoming follow-up reminders for admin view"""
    try:
        today = datetime.now(timezone.utc).strftime('%Y-%m-%d')
        
        reports = await db.consultant_reports.find(
            {
                "next_followup_date": {"$nin": [None, ""]},
                "followup_completed": {"$ne": True}
            },
            {"_id": 0}
        ).sort("next_followup_date", 1).to_list(10000)
        
        today_reminders = []
        upcoming_reminders = []
        overdue_reminders = []
        
        for report in reports:
            followup_date = report.get("next_followup_date", "")
            if followup_date:
                if followup_date == today:
                    today_reminders.append(report)
                elif followup_date > today:
                    upcoming_reminders.append(report)
                else:
                    overdue_reminders.append(report)
        
        return {
            "success": True,
            "today_reminders": today_reminders,
            "upcoming_reminders": upcoming_reminders,
            "overdue_reminders": overdue_reminders,
            "total_pending": len(today_reminders) + len(upcoming_reminders) + len(overdue_reminders)
        }
    except Exception as e:
        logger.error(f"Error fetching all reminders: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reminders")


@router.put("/consultant/reminders/{report_id}/complete", response_model=dict)
async def mark_reminder_complete(report_id: str, consultant_id: str):
    """Mark a followup reminder as complete (Already Followed Up)"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        result = await db.consultant_reports.update_one(
            {"id": report_id, "consultant_id": consultant_id},
            {"$set": {
                "followup_completed": True, 
                "followup_status": "completed",
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"success": True, "message": "Reminder marked as complete"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking reminder complete: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update reminder")


@router.put("/consultant/reminders/{report_id}/ignore", response_model=dict)
async def ignore_reminder(report_id: str, consultant_id: str):
    """Ignore a followup reminder (permanently dismissed)"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        result = await db.consultant_reports.update_one(
            {"id": report_id, "consultant_id": consultant_id},
            {"$set": {
                "followup_completed": True,
                "followup_status": "ignored",
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"success": True, "message": "Reminder ignored"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error ignoring reminder: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update reminder")


@router.delete("/admin/reminders/{report_id}", response_model=dict)
async def admin_delete_reminder(report_id: str):
    """Admin can delete/clear a reminder by removing the followup date"""
    try:
        result = await db.consultant_reports.update_one(
            {"id": report_id},
            {"$set": {
                "next_followup_date": None,
                "followup_completed": True,
                "followup_status": "deleted_by_admin",
                "updated_at": datetime.now(timezone.utc)
            }}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Report not found")
        
        return {"success": True, "message": "Reminder deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting reminder: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete reminder")


# ============ CSV BULK UPLOAD ENDPOINTS ============

@router.get("/consultant/sample-csv", response_model=dict)
async def get_sample_csv():
    """Get sample CSV format for bulk upload"""
    sample_data = [
        {
            "student_name": "John Doe",
            "contact_number": "9876543210",
            "institution_name": "ABC School",
            "competitive_exam_preference": "JEE",
            "career_interest": "Engineering",
            "college_interest": "IIT Kharagpur",
            "interest_scope": "ACTIVELY INTERESTED",
            "next_followup_date": "2026-02-25",
            "other_remarks": "Very interested in CSE"
        },
        {
            "student_name": "Jane Smith",
            "contact_number": "9123456789",
            "institution_name": "XYZ College",
            "competitive_exam_preference": "NEET",
            "career_interest": "Medical",
            "college_interest": "",
            "interest_scope": "LESS INTERESTED",
            "next_followup_date": "",
            "other_remarks": ""
        }
    ]
    
    headers = [
        "student_name", "contact_number", "institution_name", 
        "competitive_exam_preference", "career_interest", "college_interest",
        "interest_scope", "next_followup_date", "other_remarks"
    ]
    
    return {
        "success": True,
        "headers": headers,
        "sample_data": sample_data,
        "interest_scope_options": [
            "ACTIVELY INTERESTED", "LESS INTERESTED", "RECALLING NEEDED",
            "DROPOUT THIS YEAR", "ALREADY COLLEGE SELECTED", "NOT INTERESTED"
        ]
    }


@router.post("/consultant/bulk-reports", response_model=dict)
async def upload_bulk_reports(consultant_id: str, reports: list = Body(...)):
    """Upload multiple reports from CSV data"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        required_fields = ["student_name", "contact_number", "institution_name", 
                          "competitive_exam_preference", "career_interest", "interest_scope"]
        
        valid_interest_scopes = [
            "ACTIVELY INTERESTED", "LESS INTERESTED", "RECALLING NEEDED",
            "DROPOUT THIS YEAR", "ALREADY COLLEGE SELECTED", "NOT INTERESTED"
        ]
        
        success_count = 0
        errors = []
        
        for idx, report_data in enumerate(reports):
            row_num = idx + 1
            
            # Validate required fields
            missing_fields = [f for f in required_fields if not report_data.get(f, "").strip()]
            if missing_fields:
                errors.append(f"Row {row_num}: Missing required fields: {', '.join(missing_fields)}")
                continue
            
            # Validate interest_scope
            if report_data.get("interest_scope", "").strip() not in valid_interest_scopes:
                errors.append(f"Row {row_num}: Invalid interest_scope value")
                continue
            
            try:
                report_obj = {
                    "id": str(uuid.uuid4()),
                    "consultant_id": consultant_id,
                    "consultant_name": consultant_name,
                    "student_name": report_data.get("student_name", "").strip(),
                    "contact_number": report_data.get("contact_number", "").strip(),
                    "institution_name": report_data.get("institution_name", "").strip(),
                    "competitive_exam_preference": report_data.get("competitive_exam_preference", "").strip(),
                    "career_interest": report_data.get("career_interest", "").strip(),
                    "college_interest": report_data.get("college_interest", "").strip(),
                    "interest_scope": report_data.get("interest_scope", "").strip(),
                    "next_followup_date": report_data.get("next_followup_date", "").strip() or None,
                    "followup_completed": False,
                    "other_remarks": report_data.get("other_remarks", "").strip(),
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }
                
                await db.consultant_reports.insert_one(report_obj)
                
                # Auto-log successful call
                call_log = {
                    "id": str(uuid.uuid4()),
                    "consultant_id": consultant_id,
                    "consultant_name": consultant_name,
                    "student_name": report_obj["student_name"],
                    "contact_number": report_obj["contact_number"],
                    "call_type": "successful",
                    "remarks": f"Bulk upload - {report_obj['career_interest']}",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                await db.call_logs.insert_one(call_log)
                
                success_count += 1
            except Exception as e:
                errors.append(f"Row {row_num}: Failed to save - {str(e)}")
        
        return {
            "success": True,
            "message": f"Successfully uploaded {success_count} reports",
            "success_count": success_count,
            "error_count": len(errors),
            "errors": errors
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in bulk upload: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process bulk upload")



# ============ ANALYTICS ENDPOINTS ============

@router.get("/admin/analytics/overview", response_model=dict)
async def get_analytics_overview():
    """Get overview analytics for admin dashboard"""
    try:
        from datetime import timedelta
        
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        this_week_start = today - timedelta(days=today.weekday())
        this_month_start = today.replace(day=1)
        
        # Total counts
        total_reports = await db.consultant_reports.count_documents({})
        total_calls = await db.call_logs.count_documents({})
        total_admissions = await db.admissions.count_documents({})
        total_queries = await db.student_queries.count_documents({})
        
        # Today's counts
        today_iso = today.isoformat()
        today_reports = await db.consultant_reports.count_documents({
            "created_at": {"$gte": today_iso}
        })
        today_calls = await db.call_logs.count_documents({
            "created_at": {"$gte": today_iso}
        })
        
        # This week
        week_iso = this_week_start.isoformat()
        week_reports = await db.consultant_reports.count_documents({
            "created_at": {"$gte": week_iso}
        })
        
        # This month
        month_iso = this_month_start.isoformat()
        month_admissions = await db.admissions.count_documents({
            "created_at": {"$gte": month_iso}
        })
        
        return {
            "success": True,
            "overview": {
                "total_reports": total_reports,
                "total_calls": total_calls,
                "total_admissions": total_admissions,
                "total_queries": total_queries,
                "today_reports": today_reports,
                "today_calls": today_calls,
                "week_reports": week_reports,
                "month_admissions": month_admissions
            }
        }
    except Exception as e:
        logger.error(f"Error fetching analytics overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")


@router.get("/admin/analytics/call-distribution", response_model=dict)
async def get_call_distribution():
    """Get call type distribution for pie chart"""
    try:
        successful = await db.call_logs.count_documents({"call_type": "successful"})
        failed = await db.call_logs.count_documents({"call_type": "failed"})
        attempted = await db.call_logs.count_documents({"call_type": "attempted"})
        
        return {
            "success": True,
            "distribution": [
                {"name": "Successful", "value": successful, "color": "#22c55e"},
                {"name": "Failed", "value": failed, "color": "#ef4444"},
                {"name": "Attempted", "value": attempted, "color": "#eab308"}
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching call distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call distribution")


@router.get("/admin/analytics/interest-scope", response_model=dict)
async def get_interest_scope_distribution():
    """Get interest scope distribution for pie chart"""
    try:
        pipeline = [
            {"$group": {"_id": "$interest_scope", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        results = await db.consultant_reports.aggregate(pipeline).to_list(100)
        
        colors = {
            "ACTIVELY INTERESTED": "#22c55e",
            "LESS INTERESTED": "#f97316",
            "RECALLING NEEDED": "#eab308",
            "DROPOUT THIS YEAR": "#ef4444",
            "ALREADY COLLEGE SELECTED": "#3b82f6",
            "NOT INTERESTED": "#6b7280"
        }
        
        distribution = [
            {
                "name": r["_id"] or "Unknown",
                "value": r["count"],
                "color": colors.get(r["_id"], "#8b5cf6")
            }
            for r in results if r["_id"]
        ]
        
        return {"success": True, "distribution": distribution}
    except Exception as e:
        logger.error(f"Error fetching interest scope distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch interest scope distribution")


@router.get("/admin/analytics/reports-trend", response_model=dict)
async def get_reports_trend():
    """Get daily reports trend for last 14 days"""
    try:
        from datetime import timedelta
        
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        trend_data = []
        
        for i in range(13, -1, -1):
            date = today - timedelta(days=i)
            next_date = date + timedelta(days=1)
            
            count = await db.consultant_reports.count_documents({
                "created_at": {"$gte": date.isoformat(), "$lt": next_date.isoformat()}
            })
            
            trend_data.append({
                "date": date.strftime("%b %d"),
                "reports": count
            })
        
        return {"success": True, "trend": trend_data}
    except Exception as e:
        logger.error(f"Error fetching reports trend: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports trend")


@router.get("/admin/analytics/consultant-performance", response_model=dict)
async def get_consultant_performance():
    """Get consultant performance comparison"""
    try:
        # Get reports by consultant
        reports_pipeline = [
            {"$group": {"_id": "$consultant_name", "reports": {"$sum": 1}}},
            {"$sort": {"reports": -1}},
            {"$limit": 10}
        ]
        reports_results = await db.consultant_reports.aggregate(reports_pipeline).to_list(10)
        
        # Get calls by consultant
        calls_pipeline = [
            {"$group": {"_id": "$consultant_name", "calls": {"$sum": 1}}},
            {"$sort": {"calls": -1}}
        ]
        calls_results = await db.call_logs.aggregate(calls_pipeline).to_list(100)
        calls_map = {r["_id"]: r["calls"] for r in calls_results}
        
        performance = []
        for r in reports_results:
            name = r["_id"]
            if name:
                short_name = name.split()[0] if name else "Unknown"
                performance.append({
                    "name": short_name,
                    "fullName": name,
                    "reports": r["reports"],
                    "calls": calls_map.get(name, 0)
                })
        
        return {"success": True, "performance": performance}
    except Exception as e:
        logger.error(f"Error fetching consultant performance: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch consultant performance")


# ============ CONSULTANT ANALYTICS ENDPOINTS ============

@router.get("/consultant/analytics/overview/{consultant_id}", response_model=dict)
async def get_consultant_analytics_overview(consultant_id: str):
    """Get analytics overview for a specific consultant"""
    try:
        from datetime import timedelta
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")

        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        today_iso = today.isoformat()
        week_start = (today - timedelta(days=today.weekday())).isoformat()
        month_start = today.replace(day=1).isoformat()

        total_reports = await db.consultant_reports.count_documents({"consultant_id": consultant_id})
        total_calls = await db.call_logs.count_documents({"consultant_id": consultant_id})
        total_admissions = await db.admissions.count_documents({"consultant_id": consultant_id})
        today_reports = await db.consultant_reports.count_documents({"consultant_id": consultant_id, "created_at": {"$gte": today_iso}})
        today_calls = await db.call_logs.count_documents({"consultant_id": consultant_id, "created_at": {"$gte": today_iso}})
        week_reports = await db.consultant_reports.count_documents({"consultant_id": consultant_id, "created_at": {"$gte": week_start}})

        return {
            "success": True,
            "overview": {
                "total_reports": total_reports,
                "total_calls": total_calls,
                "total_admissions": total_admissions,
                "today_reports": today_reports,
                "today_calls": today_calls,
                "week_reports": week_reports
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant analytics overview: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")


@router.get("/consultant/analytics/call-distribution/{consultant_id}", response_model=dict)
async def get_consultant_call_distribution(consultant_id: str):
    """Get call type distribution for a specific consultant"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")

        successful = await db.call_logs.count_documents({"consultant_id": consultant_id, "call_type": "successful"})
        failed = await db.call_logs.count_documents({"consultant_id": consultant_id, "call_type": "failed"})
        attempted = await db.call_logs.count_documents({"consultant_id": consultant_id, "call_type": "attempted"})

        return {
            "success": True,
            "distribution": [
                {"name": "Successful", "value": successful, "color": "#22c55e"},
                {"name": "Failed", "value": failed, "color": "#ef4444"},
                {"name": "Attempted", "value": attempted, "color": "#eab308"}
            ]
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant call distribution: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch call distribution")


@router.get("/consultant/analytics/interest-scope/{consultant_id}", response_model=dict)
async def get_consultant_interest_scope(consultant_id: str):
    """Get interest scope distribution for a specific consultant"""
    try:
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")

        pipeline = [
            {"$match": {"consultant_id": consultant_id}},
            {"$group": {"_id": "$interest_scope", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        results = await db.consultant_reports.aggregate(pipeline).to_list(100)

        colors = {
            "ACTIVELY INTERESTED": "#22c55e",
            "LESS INTERESTED": "#f97316",
            "RECALLING NEEDED": "#eab308",
            "DROPOUT THIS YEAR": "#ef4444",
            "ALREADY COLLEGE SELECTED": "#3b82f6",
            "NOT INTERESTED": "#6b7280"
        }

        distribution = [
            {"name": r["_id"] or "Unknown", "value": r["count"], "color": colors.get(r["_id"], "#8b5cf6")}
            for r in results if r["_id"]
        ]

        return {"success": True, "distribution": distribution}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant interest scope: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch interest scope")


@router.get("/consultant/analytics/reports-trend/{consultant_id}", response_model=dict)
async def get_consultant_reports_trend(consultant_id: str):
    """Get daily reports trend for a specific consultant (last 14 days)"""
    try:
        from datetime import timedelta
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")

        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        trend_data = []

        for i in range(13, -1, -1):
            date = today - timedelta(days=i)
            next_date = date + timedelta(days=1)
            count = await db.consultant_reports.count_documents({
                "consultant_id": consultant_id,
                "created_at": {"$gte": date.isoformat(), "$lt": next_date.isoformat()}
            })
            trend_data.append({"date": date.strftime("%b %d"), "reports": count})

        return {"success": True, "trend": trend_data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant reports trend: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch reports trend")


@router.get("/consultant/analytics/daily-calls/{consultant_id}", response_model=dict)
async def get_consultant_daily_calls(consultant_id: str):
    """Get daily call stats for a specific consultant (last 14 days)"""
    try:
        from datetime import timedelta
        consultant_name = await get_consultant_name_async(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")

        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        trend_data = []

        for i in range(13, -1, -1):
            date = today - timedelta(days=i)
            next_date = date + timedelta(days=1)
            date_filter = {"consultant_id": consultant_id, "created_at": {"$gte": date.isoformat(), "$lt": next_date.isoformat()}}
            successful = await db.call_logs.count_documents({**date_filter, "call_type": "successful"})
            failed = await db.call_logs.count_documents({**date_filter, "call_type": "failed"})
            attempted = await db.call_logs.count_documents({**date_filter, "call_type": "attempted"})
            trend_data.append({
                "date": date.strftime("%b %d"),
                "successful": successful,
                "failed": failed,
                "attempted": attempted
            })

        return {"success": True, "trend": trend_data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching consultant daily calls: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch daily calls")


@router.get("/admin/analytics/monthly-admissions", response_model=dict)
async def get_monthly_admissions():
    """Get monthly admissions for the last 6 months"""
    try:
        from datetime import timedelta
        
        today = datetime.now(timezone.utc)
        monthly_data = []
        
        for i in range(5, -1, -1):
            # Calculate month start and end
            month = today.month - i
            year = today.year
            while month <= 0:
                month += 12
                year -= 1
            
            month_start = datetime(year, month, 1, tzinfo=timezone.utc)
            if month == 12:
                month_end = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
            else:
                month_end = datetime(year, month + 1, 1, tzinfo=timezone.utc)
            
            count = await db.admissions.count_documents({
                "created_at": {"$gte": month_start.isoformat(), "$lt": month_end.isoformat()}
            })
            
            monthly_data.append({
                "month": month_start.strftime("%b"),
                "admissions": count
            })
        
        return {"success": True, "monthly": monthly_data}
    except Exception as e:
        logger.error(f"Error fetching monthly admissions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch monthly admissions")


# ============ LEADERBOARD ENDPOINTS ============

@router.get("/leaderboard", response_model=dict)
async def get_leaderboard(period: str = "all"):
    """Get consultant leaderboard with rankings and badges"""
    try:
        from datetime import timedelta
        consultants = await get_all_consultants_async()
        today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

        date_filter = {}
        if period == "weekly":
            start = (today - timedelta(days=today.weekday())).isoformat()
            date_filter = {"created_at": {"$gte": start}}
        elif period == "monthly":
            start = today.replace(day=1).isoformat()
            date_filter = {"created_at": {"$gte": start}}

        leaderboard = []
        for c in consultants:
            cid = c["user_id"]
            cname = c["name"]

            report_filter = {"consultant_id": cid, **date_filter}
            call_filter = {"consultant_id": cid, **date_filter}

            total_reports = await db.consultant_reports.count_documents(report_filter)
            total_calls = await db.call_logs.count_documents(call_filter)
            successful_calls = await db.call_logs.count_documents({**call_filter, "call_type": "successful"})
            failed_calls = await db.call_logs.count_documents({**call_filter, "call_type": "failed"})
            attempted_calls = await db.call_logs.count_documents({**call_filter, "call_type": "attempted"})
            total_admissions = await db.admissions.count_documents({"consultant_id": cid, **date_filter})

            success_rate = round((successful_calls / total_calls * 100), 1) if total_calls > 0 else 0
            score = (total_reports * 10) + (successful_calls * 5) + (total_admissions * 50) + (attempted_calls * 2)

            # Determine badges
            badges = []
            if total_reports >= 50:
                badges.append({"name": "Report Master", "icon": "file-text", "color": "#8b5cf6"})
            elif total_reports >= 20:
                badges.append({"name": "Active Reporter", "icon": "file-text", "color": "#3b82f6"})
            if successful_calls >= 100:
                badges.append({"name": "Call Champion", "icon": "phone", "color": "#22c55e"})
            elif successful_calls >= 30:
                badges.append({"name": "Steady Caller", "icon": "phone", "color": "#06b6d4"})
            if success_rate >= 90 and total_calls >= 10:
                badges.append({"name": "Sharpshooter", "icon": "target", "color": "#f59e0b"})
            if total_admissions >= 10:
                badges.append({"name": "Enrollment King", "icon": "crown", "color": "#f59e0b"})
            elif total_admissions >= 3:
                badges.append({"name": "Closer", "icon": "award", "color": "#ec4899"})
            if total_calls >= 5 and total_calls == successful_calls:
                badges.append({"name": "Perfect Streak", "icon": "zap", "color": "#eab308"})

            leaderboard.append({
                "consultant_id": cid,
                "consultant_name": cname,
                "total_reports": total_reports,
                "total_calls": total_calls,
                "successful_calls": successful_calls,
                "failed_calls": failed_calls,
                "attempted_calls": attempted_calls,
                "total_admissions": total_admissions,
                "success_rate": success_rate,
                "score": score,
                "badges": badges
            })

        # Sort by score descending
        leaderboard.sort(key=lambda x: x["score"], reverse=True)

        # Assign ranks and medals
        for i, entry in enumerate(leaderboard):
            entry["rank"] = i + 1
            if i == 0:
                entry["medal"] = "gold"
            elif i == 1:
                entry["medal"] = "silver"
            elif i == 2:
                entry["medal"] = "bronze"
            else:
                entry["medal"] = None

        return {"success": True, "leaderboard": leaderboard, "period": period}
    except Exception as e:
        logger.error(f"Error fetching leaderboard: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboard")

