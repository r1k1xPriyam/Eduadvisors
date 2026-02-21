from fastapi import APIRouter, HTTPException
from models import StudentQuery, StudentQueryCreate, College, Course, ConsultantReport, ConsultantReportCreate
from typing import List
import logging
from datetime import datetime
from consultants import verify_consultant, get_consultant_name, get_all_consultants, add_consultant, update_consultant, delete_consultant

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
        consultants = get_all_consultants()
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
    """Add a new consultant"""
    try:
        result = add_consultant(user_id, name, password)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        logger.info(f"Consultant {user_id} added successfully")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding consultant: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to add consultant")

@router.put("/admin/consultants/{user_id}", response_model=dict)
async def modify_consultant(user_id: str, new_user_id: str = None, password: str = None):
    """Update consultant details - Only User ID and Password can be changed"""
    try:
        result = update_consultant(user_id, new_user_id, password)
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        logger.info(f"Consultant {user_id} updated successfully")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating consultant: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update consultant")

@router.delete("/admin/consultants/{user_id}", response_model=dict)
async def remove_consultant(user_id: str):
    """Delete a consultant"""
    try:
        result = delete_consultant(user_id)
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["message"])
        logger.info(f"Consultant {user_id} deleted successfully")
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
        if student_name: update_data["student_name"] = student_name
        if course: update_data["course"] = course
        if college: update_data["college"] = college
        if admission_date: update_data["admission_date"] = admission_date
        if payout_amount is not None: update_data["payout_amount"] = payout_amount
        if payout_status: update_data["payout_status"] = payout_status
        
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
    """Log a call (can be quick log without full details)"""
    try:
        consultant_name = get_consultant_name(consultant_id)
        if not consultant_name:
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        call_log = {
            "id": f"call_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{consultant_id}",
            "consultant_id": consultant_id,
            "consultant_name": consultant_name,
            "call_type": call_type,
            "student_name": student_name or "N/A",
            "contact_number": contact_number or "N/A",
            "remarks": remarks or "",
            "created_at": datetime.utcnow().isoformat()
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
        consultant_name = get_consultant_name(consultant_id)
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

# ============ BULK DELETE ENDPOINTS (Admin) ============

ADMIN_PASSWORD = "Eduadvisors@2026"

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

